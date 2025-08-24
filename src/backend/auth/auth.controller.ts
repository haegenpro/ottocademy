import { Controller, Post, Body, UseGuards, Get, Request, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Response } from 'express';

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
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Registration failed',
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
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Login failed',
        data: null,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  async getSelf(@Request() req) {
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
      },
    };
  }

  @Get('debug/env')
  debugEnv() {
    return {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasGoogleCallbackUrl: !!process.env.GOOGLE_CALLBACK_URL,
      googleClientId: process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id' ? 'PLACEHOLDER' : 'CONFIGURED',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    // Debug environment variables
    console.log('=== Google OAuth Debug ===');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '[HIDDEN]' : 'undefined');
    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('========================');
    
    // Check if Google OAuth is properly configured
    if (process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id' || !process.env.GOOGLE_CLIENT_ID) {
      console.log('Google OAuth validation failed - not configured');
      throw new Error('Google OAuth is not configured. Please contact the administrator.');
    }
    
    console.log('Google OAuth validation passed - redirecting to Google');
    // This will be handled by the GoogleAuthGuard using Passport
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const result = req.user;
      
      // Instead of setting HTTP-only cookie, redirect with token in URL
      // The frontend will extract it and store in localStorage
      const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
      
      // Encode the token to make it URL-safe
      const encodedToken = encodeURIComponent(result.token);
      
      // Redirect to auth page with token - frontend will handle storage and redirect
      res.redirect(`${frontendUrl}/auth.html?oauth=success&token=${encodedToken}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
      res.redirect(`${frontendUrl}/auth.html?oauth=error&message=${encodeURIComponent('Authentication failed')}`);
    }
  }
}