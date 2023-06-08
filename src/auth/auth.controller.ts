import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AllowUnauthorizedRequest } from './auth.decorator';
import { PATH_AUTH } from 'src/routes';
import { ERROR_MISSING_FIELDS } from 'src/errors/messages';
import { UserService } from 'src/users/users.service';
import { User } from '@prisma/client';

export interface LoginDTO {
  email: string;
  password: string;
}

@Controller(PATH_AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @AllowUnauthorizedRequest()
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { email, password } = loginDTO;

    if (!email || !password) {
      throw new BadRequestException(ERROR_MISSING_FIELDS);
    }

    const token = await this.authService.login(email, password);

    res.cookie('auth.token', token);
    res.statusCode = 200;
    res.send({ token });
  }

  @Get('userme/:id')
  async recoverUserData(@Param('id') id: string): Promise<User> {
    return this.userService.findById(Number(id));
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) req: Response) {
    req.clearCookie('token');
  }
}
