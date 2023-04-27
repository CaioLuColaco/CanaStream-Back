import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PATH_USERS } from 'src/routes';
import { CreateUserDTO } from './dtos';
import { User } from '@prisma/client';
import {
  ERROR_EMAIL_IN_USE,
  ERROR_MISSING_FIELDS,
  ERROR_PASSWORDS_DONT_MATCH,
} from 'src/errors/messages';
import { UserService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';

@Controller(PATH_USERS)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<User> {
    const { email, password, passwordConfirmation } = body;

    if (!email || !password || !passwordConfirmation) {
      throw new BadRequestException(ERROR_MISSING_FIELDS);
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestException(ERROR_PASSWORDS_DONT_MATCH);
    }

    const emailInUse = await this.userService.findOneByEmail(email);

    if (emailInUse) {
      throw new ConflictException(ERROR_EMAIL_IN_USE);
    }

    const newUser: User = await this.userService.create(body);

    return newUser;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) req: Response) {
    req.clearCookie('token');
  }
}
