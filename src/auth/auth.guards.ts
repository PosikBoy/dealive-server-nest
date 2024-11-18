import { Messages } from '@/constants/messages';
import { TokensService } from '@/tokens/tokens.service';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class CourierJwtGuard implements CanActivate {
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

      if (user.role !== 'courier') {
        return false;
      }
      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
    }
  }
}

export class ClientJwtGuard implements CanActivate {
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

      if (user.role !== 'client') {
        return false;
      }

      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException({ message: Messages.UNAUTHORIZED });
    }
  }
}
