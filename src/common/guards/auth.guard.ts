import { Messages } from '@/common/constants/error-messages';
import { TokensService } from '@/tokens/tokens.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../auth/decorators/roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private tokenService: TokensService,
    private reflector: Reflector,
  ) {}

  /**
   * RolesGuard проверяет, что у пользователя есть необходимая роль для доступа к роуту.
   * - Сначала извлекает роли, требуемые для доступа из метаданных декоратора @Roles.
   * - Если роли не заданы, доступ разрешается.
   * - Иначе проверяет заголовок Authorization, валидирует JWT-токен.
   * - Затем проверяет, содержится ли роль пользователя в списке разрешённых.
   * - Если что-то не так — выбрасывает UnauthorizedException.
   */
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

  /**
   * JwtGuard проверяет, что запрос содержит валидный JWT-токен.
   * - Извлекает и проверяет заголовок Authorization.
   * - Валидирует токен через TokensService.
   * - Если токен валиден, прикрепляет пользователя к запросу и разрешает доступ.
   * - Если нет — выбрасывает UnauthorizedException.
   */

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

  /**
   * OptionalJwtGuard позволяет пропускать запросы и без токена, и с токеном.
   * - Если заголовок Authorization отсутствует — доступ разрешается.
   * - Если есть токен — валидирует его и добавляет пользователя к запросу.
   * - Если токен неверный — выбрасывает UnauthorizedException.
   *
   * Используется для роутов, где авторизация не обязательна, но если есть токен — пользователь идентифицируется.
   */
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
