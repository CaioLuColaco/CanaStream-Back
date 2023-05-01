import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO } from './dtos';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateUserDTO): Promise<User> {
    const { email, username, password } = data;

    try {
      const hash: string = this.authService.generateHash(password);
      const user = await this.prisma.user.create({
        data: { email, password: hash, username },
      });

      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
