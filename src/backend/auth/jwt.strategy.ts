import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Fail fast/loud: a missing JWT secret must never silently fall
      // through to passport-jwt, which would otherwise accept `undefined`.
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    console.log('JWT payload received:', {
      sub: payload.sub,
      username: payload.username,
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      console.error(`User not found for JWT payload: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    console.log(
      `User authenticated: ${user.username} (Admin: ${user.isAdmin})`,
    );
    const { password: _password, ...result } = user;
    return result;
  }
}
