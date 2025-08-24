import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, username, password, firstName, lastName } = registerUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;
    
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { username: user.username, sub: user.id };

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        purchasedCourses: {
          include: {
            course: {
              include: {
                modules: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        moduleCompletions: {
          where: { isCompleted: true },
          include: {
            module: {
              select: {
                id: true,
                title: true,
                courseId: true,
              },
            },
          },
        },
        certificates: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                instructor: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      ...userWithoutPassword,
      balance: userWithoutPassword.balance / 100,
    };
  }

  async updateProfile(userId: string, updateData: { username?: string; firstName?: string; lastName?: string }) {
    if (updateData.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateData.username },
      });
      
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username already taken.');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
      ...userWithoutPassword,
      balance: userWithoutPassword.balance / 100,
    };
  }

  async updatePassword(userId: string, passwordData: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password updated successfully.' };
  }

  async validateGoogleUser(googleUser: any) {
    const { googleId, email, firstName, lastName, picture } = googleUser;

    // Check if user exists by email or Google ID
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId },
        ],
      },
    });

    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      // Create new user
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 8);
      
      user = await this.prisma.user.create({
        data: {
          email,
          username,
          firstName,
          lastName,
          googleId,
          password: '', // Google users don't need a password
          picture,
        },
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
      },
      token,
    };
  }
}