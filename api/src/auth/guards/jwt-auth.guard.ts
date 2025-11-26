import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private exclusions = jwtConfig().exclusions;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const method = request.method;

    // Check if route is in exclusion list
    const isExcluded = this.exclusions.some((exclusion) => {
      const pathMatches = new RegExp(
        `^${exclusion.path.replace(/\*/g, '.*')}$`,
      ).test(path);
      const methodMatches =
        exclusion.method === 'ALL' || exclusion.method === method;
      return pathMatches && methodMatches;
    });

    if (isExcluded) {
      return true;
    }

    // Check if route is marked as public with decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // For protected routes, validate JWT and user
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // If there's an error or no user, throw unauthorized
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    if (!user.userId || !user.email) {
      throw new UnauthorizedException('Invalid user data in token');
    }
    // Only allow admin users
    if (!user.isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }
    return user;
  }
}
