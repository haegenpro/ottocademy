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
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  getSelf(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: { username?: string; firstName?: string; lastName?: string }) {
    return this.authService.updateProfile(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  updatePassword(@Request() req, @Body() passwordData: { currentPassword: string; newPassword: string }) {
    return this.authService.updatePassword(req.user.id, passwordData);
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
  async googleAuth(@Request() req, @Res() res: Response) {
    // Debug environment variables
    console.log('=== Google OAuth Debug ===');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '[HIDDEN]' : 'undefined');
    console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('========================');
    
    // Check if Google OAuth is properly configured
    if (process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id' || !process.env.GOOGLE_CLIENT_ID) {
      console.log('Google OAuth validation failed - not configured');
      return res.status(501).json({
        status: 'error',
        message: 'Google OAuth is not configured. Please contact the administrator.',
      });
    }
    
    console.log('Google OAuth validation passed - redirecting to Google');
    // If configured, redirect to Google OAuth
    return res.redirect(`https://accounts.google.com/oauth/authorize?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback')}&scope=email%20profile`);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      const result = req.user;
      
      // Set the token as an HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      });

      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth.html?oauth=success`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth.html?oauth=error`);
    }
  }
}