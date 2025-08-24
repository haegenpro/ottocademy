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
          isAdmin: true,
          googleId: true,
          picture: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      status: 'success',
      data: {
        users,
        pagination: {
          current_page: page,
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        balance: true,
        isAdmin: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        balance: true,
        isAdmin: true,
      },
    });
    return updatedUser;
  }

  async remove(id: string, adminUserId: string) {
    const userToDelete = await this.findOne(id);
    const adminUser = await this.findOne(adminUserId);

    // Prevent admin from deleting themselves
    if (id === adminUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // Prevent deletion of other admin users (optional - you can remove this if admins should be able to delete each other)
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

  async addBalance(id: string, addBalanceDto: AddBalanceDto) {
    await this.findOne(id);

    const { amount } = addBalanceDto;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        balance: {
          increment: amount,
        },
      },
      select: {
        id: true,
        balance: true,
      },
    });

    return updatedUser;
  }
}