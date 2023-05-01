import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MusicsService } from './musics.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PATH_MUSICS } from 'src/routes';
import { Music } from '@prisma/client';
import { CreateMusicDTO } from './dtos';
import { ERROR_MISSING_FIELDS } from 'src/errors/messages';

UseGuards(AuthGuard);
@Controller(PATH_MUSICS)
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @Post()
  async create(@Body() body: CreateMusicDTO): Promise<Music> {
    const { name, url, artistId }: CreateMusicDTO = body;

    if (!name || !url || !artistId) {
      throw new BadRequestException(ERROR_MISSING_FIELDS);
    }

    const newMusic: Music = await this.musicsService.create(body);

    return newMusic;
  }

  @Get()
  async getAll(@Query() params: any): Promise<Music[]> {
    return this.musicsService.findAll(params);
  }
}
