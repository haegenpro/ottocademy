import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    console.log('=== Google Strategy Init ===');
    console.log('GOOGLE_CLIENT_ID:', clientID);
    console.log('GOOGLE_CLIENT_SECRET:', clientSecret ? '[HIDDEN]' : 'undefined');
    console.log('============================');
    
    if (!clientID || !clientSecret || clientID === 'placeholder-client-id') {
      console.warn('Google OAuth is not properly configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
      // Provide dummy values to prevent startup crash
      super({
        clientID: 'dummy-client-id',
        clientSecret: 'dummy-client-secret',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://127.0.0.1:3000/auth/google/callback',
        scope: ['email', 'profile'],
      });
      return;
    }

    console.log('Google Strategy: Using real credentials');
    super({
      clientID,
      clientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://127.0.0.1:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const user = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    try {
      const validatedUser = await this.authService.validateGoogleUser(user);
      done(null, validatedUser);
    } catch (error) {
      done(error, false);
    }
  }
}
