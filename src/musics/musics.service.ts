import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMusicDTO } from './dtos';
import { Music } from '@prisma/client';

@Injectable()
export class MusicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMusicDTO): Promise<Music> {
    const { artistId } = data;

    try {
      // verificar se existe artista

      const music: Music = await this.prisma.music.create({ data });
      return music;
    } catch (err) {
      console.log(err.message);
    }
  }
}
