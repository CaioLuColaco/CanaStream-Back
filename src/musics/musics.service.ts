import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMusicDTO } from './dtos';
import { Music } from '@prisma/client';

@Injectable()
export class MusicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMusicDTO): Promise<Music> {
    try {
      const music: Music = await this.prisma.music.create({ data });
      return music;
    } catch (err) {
      console.log(err.message);
    }
  }

  async findAll({ artistId }: any): Promise<Music[]> {
    const where = {};
    if (artistId) where['artistId'] = Number(artistId);
    return this.prisma.music.findMany({
      where,
      include: { artist: true },
    }) as unknown as Music[];
  }
}
