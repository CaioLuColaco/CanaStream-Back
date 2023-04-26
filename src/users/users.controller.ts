import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
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

@Controller(PATH_USERS)
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
}
