import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

export interface LoginDTO {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { email, password } = loginDTO;

    if (!email || !password) {
      throw new BadRequestException('Missing login fields');
    }

    const token = await this.authService.login(email, password);

    res.cookie('token', token, { httpOnly: true });
  }
}
