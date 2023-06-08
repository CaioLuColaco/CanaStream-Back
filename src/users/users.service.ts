import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { userSelect } from 'src/utils/default-entities-select';
import { ERROR_MUST_PROVIDE_CURRENT_PASSWORD } from 'src/errors/messages';

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
        select: userSelect,
      });

      return user;
    } catch (err) {
      console.log(err.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const { username, email, newPassword, currentPassword } = data;
    const updatedData = { username, email };

    if (newPassword) {
      const user = await this.prisma.user.findFirst({ where: { id } });
      const passwordIsCorrect = this.authService.comparePasswordHash(
        currentPassword,
        user.password,
      );
      if (!passwordIsCorrect) {
        throw new ForbiddenException(ERROR_MUST_PROVIDE_CURRENT_PASSWORD);
      }
      updatedData['password'] = this.authService.generateHash(newPassword);
    }

    return this.prisma.user.update({
      where: { id },
      data: updatedData,
      select: userSelect,
    });
  }
}
