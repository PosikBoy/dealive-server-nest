import { Messages } from '@/constants/messages';
import { TokensService } from '@/tokens/tokens.service';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';

export class JwtGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
      }

      const user = this.tokenService.validateToken(token);
      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
    }
  }
}

export class RolesGuard implements CanActivate {
  constructor(
    private tokenService: TokensService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log(requiredRoles);
      if (!requiredRoles) {
        return true;
      }
      const authHeader = request.headers.Authorization;

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
      }

      const user = this.tokenService.validateToken(token);

      request.user = user;

      return user.role === requiredRoles;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
    }
  }
}
