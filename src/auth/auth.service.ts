import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    console.log(process.env.JWT_SECRET);

    if (!bcrypt.compareSync(password, user?.password)) {
      throw new UnauthorizedException('Email or password wrong');
    }

    const payload = { email, id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
