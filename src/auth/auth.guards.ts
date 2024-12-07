import { Messages } from '@/constants/messages';
import { TokensService } from '@/tokens/tokens.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './decorators/roles-auth.decorator';

@Injectable()
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

      if (!requiredRoles) {
        return true;
      }
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException(Messages.UNAUTHORIZED);
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException(Messages.UNAUTHORIZED);
      }

      const user = this.tokenService.validateToken(token);

      request.user = user;
      return requiredRoles.includes(user.role);
    } catch (error) {
      throw new UnauthorizedException(error.message || Messages.UNAUTHORIZED);
    }
  }
}

@Injectable()
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
        throw new UnauthorizedException(Messages.UNAUTHORIZED);
      }

      const user = this.tokenService.validateToken(token);

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException(Messages.UNAUTHORIZED);
    }
  }
}

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) return true;
      const token = authHeader.split(' ')[1];
      const user = this.tokenService.validateToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || Messages.UNAUTHORIZED);
    }
  }
}
