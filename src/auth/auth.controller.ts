import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AllowUnauthorizedRequest } from './auth.decorator';
import { PATH_AUTH } from 'src/routes';
import { ERROR_MISSING_FIELDS } from 'src/errors/messages';

export interface LoginDTO {
  email: string;
  password: string;
}

@Controller(PATH_AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

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

    res.cookie('token', token, { httpOnly: true });
    res.statusCode = 200;
    res.send({ token });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) req: Response) {
    req.clearCookie('token');
  }
}
