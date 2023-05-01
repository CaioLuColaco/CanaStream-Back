import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArtistsDTO } from './dtos';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArtistsDTO): Promise<Artist> {
    const artist: Artist = await this.prisma.artist.create({ data });
    return artist;
  }

  async findOneByName(name: string): Promise<Artist> {
    return this.prisma.artist.findFirst({ where: { name } });
  }
}
