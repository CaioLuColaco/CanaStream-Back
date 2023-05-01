import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PATH_USERS } from 'src/routes';
import { CreateUserDTO } from './dtos';
import { Playlist, User } from '@prisma/client';
import {
  ERROR_EMAIL_IN_USE,
  ERROR_MISSING_FIELDS,
  ERROR_PASSWORDS_DONT_MATCH,
} from 'src/errors/messages';
import { UserService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AllowUnauthorizedRequest } from 'src/auth/auth.decorator';
import { PlaylistsService } from 'src/playlists/playlists.service';
@UseGuards(AuthGuard)
@Controller(PATH_USERS)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly playlistService: PlaylistsService,
  ) {}

  @Post()
  @AllowUnauthorizedRequest()
  async create(@Body() body: CreateUserDTO): Promise<User> {
    const { email, password, passwordConfirmation, username } = body;

    if (!email || !username || !password || !passwordConfirmation) {
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

  @Get(':id/playlists')
  async getPlaylistsByUserId(@Param('id') id: string): Promise<Playlist[]> {
    return this.playlistService.findAll({ userId: Number(id) });
  }
}
