import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PATH_PLAYLISTS } from 'src/routes';
import { AuthGuard } from 'src/auth/auth.guard';
import { Playlist, User } from '@prisma/client';
import { CreatePlaylistDTO, UpdatePlaylistDTO } from './dtos';
import { ERROR_MISSING_FIELDS } from 'src/errors/messages';

@UseGuards(AuthGuard)
@Controller(PATH_PLAYLISTS)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  async create(
    @Body() body: CreatePlaylistDTO,
    @Req() { user }: Request & { user: User },
  ): Promise<Playlist> {
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePlaylistDTO,
    @Req() { user },
  ): Promise<Playlist> {
    const playlist = await this.playlistsService.findOne(Number(id));

    if (playlist.userId != user.id) {
      throw new UnauthorizedException();
    }

    const updatedPlaylist = await this.playlistsService.update(
      Number(id),
      body,
    );

    return updatedPlaylist;
  }
}
