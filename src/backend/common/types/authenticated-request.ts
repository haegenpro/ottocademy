import { Request } from 'express';
import { User } from '@prisma/client';

/**
 * Shape of `req.user` once JwtStrategy.validate() has run (see
 * ../../auth/jwt.strategy.ts) - the full Prisma User row minus the
 * password hash.
 */
export type AuthenticatedUser = Omit<User, 'password'>;

/** An Express Request after JwtAuthGuard has populated `req.user`. */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/** Shape `req.user` takes after GoogleAuthGuard runs GoogleStrategy.validate()
 * (see ../../auth/google.strategy.ts / AuthService.validateGoogleUser). */
export interface GoogleAuthenticatedRequest extends Request {
  user: {
    user: Pick<
      User,
      'id' | 'email' | 'username' | 'firstName' | 'lastName' | 'picture'
    >;
    token: string;
  };
}
