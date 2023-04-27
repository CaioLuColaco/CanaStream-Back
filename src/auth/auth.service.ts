import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!this.comparePasswordHash(password, user?.password)) {
      throw new UnauthorizedException('Email or password wrong');
    }

    const payload = { email, id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  generateHash(password: string): string {
    return crypto.createHash('sha512').update(password).digest('base64');
  }

  comparePasswordHash(password: string, hash: string): boolean {
    return this.generateHash(password) === hash;
  }
}
