import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(`Admin guard check - User: ${user?.username}, isAdmin: ${user?.isAdmin}`);

    if (!user || !user.isAdmin) {
      console.error(`Access denied for user: ${user?.username} (isAdmin: ${user?.isAdmin})`);
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}