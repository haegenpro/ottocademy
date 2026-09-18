import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Response } from 'express';
import type {
  AuthenticatedRequest,
  GoogleAuthenticatedRequest,
} from '../common/types/authenticated-request';
import { getErrorMessage } from '../common/utils/get-error-message';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await this.authService.register(registerUserDto);
      return {
        status: 'success',
        message: 'Registration successful',
        data: {
          id: user.id,
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        message: getErrorMessage(error, 'Registration failed'),
        data: null,
      };
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginUserDto);
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          username: result.user.username,
          token: result.access_token,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        message: getErrorMessage(error, 'Login failed'),
        data: null,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  async getSelf(@Request() req: AuthenticatedRequest) {
    try {
      const profile = await this.authService.getProfile(req.user.id);
      return {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          balance: profile.balance,
          isAdmin: profile.isAdmin,
        },
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        message: getErrorMessage(error, 'Failed to retrieve profile'),
        data: null,
      };
    }
  }

  @Get('debug/env')
  debugEnv() {
    return {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasGoogleCallbackUrl: !!process.env.GOOGLE_CALLBACK_URL,
      googleClientId:
        process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id'
          ? 'PLACEHOLDER'
          : 'CONFIGURED',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('debug/token')
  debugToken(@Request() req: AuthenticatedRequest) {
    return {
      status: 'success',
      message: 'Token is valid',
      data: {
        userId: req.user.id,
        username: req.user.username,
        isAdmin: req.user.isAdmin,
        tokenValidated: true,
      },
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // Guard initiates the Google redirect; this body only runs for debug
  // logging when the guard lets the request through.
  googleAuth() {
    console.log('=== Google OAuth Debug ===');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log(
      'GOOGLE_CLIENT_SECRET:',
      process.env.GOOGLE_CLIENT_SECRET ? '[HIDDEN]' : 'undefined',
    );
    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('========================');

    if (
      process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id' ||
      !process.env.GOOGLE_CLIENT_ID
    ) {
      console.log('Google OAuth validation failed - not configured');
      throw new Error(
        'Google OAuth is not configured. Please contact the administrator.',
      );
    }

    console.log('Google OAuth validation passed - redirecting to Google');
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @Request() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      const result = req.user;

      const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';

      const encodedToken = encodeURIComponent(result.token);

      res.redirect(
        `${frontendUrl}/auth.html?oauth=success&token=${encodedToken}`,
      );
    } catch (error: unknown) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
      res.redirect(
        `${frontendUrl}/auth.html?oauth=error&message=${encodeURIComponent('Authentication failed')}`,
      );
    }
  }
}
