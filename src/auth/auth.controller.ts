import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface LoginDTO {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: LoginDTO): Promise<any> {
    const { email, password } = loginDTO;

    if (!email || !password) {
      throw new BadRequestException('Missing login fields');
    }

    return this.authService.login(email, password);
  }
}
