import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Put,
  Delete,
  Post,
  Query,
  Request,
  HttpCode,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddBalanceDto } from './dto/add-balance.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('q') search?: string,
  ) {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      return await this.usersService.findAll(pageNum, limitNum, search);
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to retrieve users',
        data: null,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to retrieve user',
        data: null,
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    try {
      const user = await this.usersService.update(id, updateUserDto, req.user.id);
      return {
        status: 'success',
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to update user',
        data: null,
      };
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const adminUserId = req.user.id;
    await this.usersService.remove(id, adminUserId);
    res.status(204).send();
  }

  @Post(':id/balance')
  async addBalance(@Param('id') id: string, @Body() addBalanceDto: AddBalanceDto, @Request() req) {
    try {
      const user = await this.usersService.addBalance(id, addBalanceDto.increment, req.user.id);
      return {
        status: 'success',
        message: 'Balance updated successfully',
        data: {
          id: user.id,
          username: user.username,
          balance: user.balance,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to update balance',
        data: null,
      };
    }
  }
}