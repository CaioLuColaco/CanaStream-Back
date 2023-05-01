import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PATH_ARTISTS } from 'src/routes';
import { CreateArtistsDTO } from './dtos';
import { Artist } from '@prisma/client';
import {
  ERROR_ARTIST_ALREADY_EXISTS,
  ERROR_MISSING_FIELDS,
} from 'src/errors/messages';

@UseGuards(AuthGuard)
@Controller(PATH_ARTISTS)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body() body: CreateArtistsDTO): Promise<Artist> {
    const { name }: CreateArtistsDTO = body;

    if (!name) {
      throw new BadRequestException(ERROR_MISSING_FIELDS);
    }

    const artistsExists: Artist = await this.artistsService.findOneByName(name);

    if (artistsExists) {
      throw new ConflictException(ERROR_ARTIST_ALREADY_EXISTS);
    }

    const newArtist: Artist = await this.artistsService.create(body);

    return newArtist;
  }
}
