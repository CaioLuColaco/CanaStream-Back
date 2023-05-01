import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlaylistDTO } from './dtos';
import { Playlist } from '@prisma/client';
import { playlistSelect } from 'src/utils/default-entities-select';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaylistDTO, userId: number): Promise<Playlist> {
    const { name } = data;

    try {
      const musics =
        data?.musics?.length > 0
          ? { connect: data.musics.map((id) => ({ id })) }
          : undefined;

      const playlist = await this.prisma.playlist.create({
        data: {
          name,
          userId,
          musics,
        },
        include: { musics: true },
      });

      console.log({ playlist });
      return playlist;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(params: any = {}): Promise<Playlist[]> {
    console.log({ params });
    return this.prisma.playlist.findMany({
      where: params,
      select: playlistSelect,
    }) as unknown as Playlist[];
  }
}
