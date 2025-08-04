import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddBalanceDto } from './dto/add-balance.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
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

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    // Return a confirmation message
    return { message: `User with ID "${id}" has been deleted.` };
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