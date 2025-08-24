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
} from '@nestjs/common';
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
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.usersService.findAll(pageNum, limitNum, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // Get the admin user ID from the JWT token
    const adminUserId = req.user.id;
    return this.usersService.remove(id, adminUserId);
  }

  @Post(':id/balance')
  addBalance(@Param('id') id: string, @Body() addBalanceDto: AddBalanceDto) {
    return this.usersService.addBalance(id, addBalanceDto);
  }
}