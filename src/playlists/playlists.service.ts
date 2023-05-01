import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlaylistDTO } from './dtos';
import { Playlist, User } from '@prisma/client';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaylistDTO, user: User): Promise<Playlist> {
    const { name } = data;

    try {
      const musics =
        data?.musics?.length > 0
          ? { connect: data.musics.map((id) => ({ id })) }
          : undefined;

      const playlist = await this.prisma.playlist.create({
        data: {
          name,
          userId: user.id,
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
      select: {
        name: true,
        musics: {
          select: { name: true, url: true, artist: { select: { name: true } } },
        },
        user: { select: { password: false, username: true } },
      },
    }) as unknown as Playlist[];
  }
}
