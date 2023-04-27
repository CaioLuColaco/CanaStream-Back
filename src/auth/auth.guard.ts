import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { STRING_ALLOW_UNAUTHORIZED_REQUESTS } from 'src/utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const authorized = this.reflector.get<boolean>(
      STRING_ALLOW_UNAUTHORIZED_REQUESTS,
      ctx.getHandler(),
    );
    if (authorized) {
      return true;
    }
    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'asdf',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['token'];
    return token;
  }
}
