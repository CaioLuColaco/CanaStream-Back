import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PATH_PLAYLISTS } from 'src/routes';
import { AuthGuard } from 'src/auth/auth.guard';
import { Playlist, User } from '@prisma/client';
import { CreatePlaylistDTO } from './dtos';
import { ERROR_MISSING_FIELDS } from 'src/errors/messages';

@UseGuards(AuthGuard)
@Controller(PATH_PLAYLISTS)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  async create(@Req() req: Request & { user: User }): Promise<Playlist> {
    const body = req.body as unknown as CreatePlaylistDTO;
    const user = req.user;
    console.log({ user });

    if (!body.name) {
      throw new BadRequestException(ERROR_MISSING_FIELDS);
    }

    const newPlaylist = await this.playlistsService.create(body, user.id);

    return newPlaylist;
  }

  @Get()
  async getAll(): Promise<Playlist[]> {
    return this.playlistsService.findAll();
  }
}
