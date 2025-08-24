import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddBalanceDto } from './dto/add-balance.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { username: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          balance: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const transformedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      balance: user.balance,
    }));

    return {
      status: 'success',
      message: 'Users retrieved successfully',
      data: transformedUsers,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        purchasedCourses: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      balance: user.balance,
      courses_purchased: user.purchasedCourses.length,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto, adminUserId: string) {
    if (id === adminUserId) {
      throw new ForbiddenException('Admin cannot modify their own account');
    }

    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: { id: true, isAdmin: true },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isAdmin) {
      throw new ForbiddenException('Cannot modify admin accounts');
    }

    const updateData: any = { ...updateUserDto };
    
    // Map frontend field names to database field names
    if (updateUserDto.first_name) {
      updateData.firstName = updateUserDto.first_name;
      delete updateData.first_name;
    }
    if (updateUserDto.last_name) {
      updateData.lastName = updateUserDto.last_name;
      delete updateData.last_name;
    }
    
    if (updateUserDto.password) {
      const bcrypt = await import('bcrypt');
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        balance: true,
      },
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      first_name: updatedUser.firstName,
      last_name: updatedUser.lastName,
      balance: updatedUser.balance,
    };
  }

  async remove(id: string, adminUserId: string) {
    const userToDelete = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, isAdmin: true },
    });

    if (!userToDelete) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (id === adminUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    if (userToDelete.isAdmin) {
      throw new ForbiddenException('Cannot delete another admin user');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { 
      status: 'success', 
      message: `User with ID "${id}" has been deleted.` 
    };
  }

  async addBalance(id: string, increment: number, adminUserId: string) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        balance: {
          increment: increment,
        },
      },
      select: {
        id: true,
        username: true,
        balance: true,
      },
    });

    return updatedUser;
  }
}