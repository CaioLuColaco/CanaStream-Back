import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO } from './dtos';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_HASH_ROUNDS } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<User> {
    const { email, password } = data;

    try {
      const hash: string = bcrypt.hashSync(password, DEFAULT_HASH_ROUNDS);

      const user = await this.prisma.user.create({
        data: { email, password: hash },
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
