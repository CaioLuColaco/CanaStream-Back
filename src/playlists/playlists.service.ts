import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePlaylistDTO, UpdatePlaylistDTO } from './dtos';
import { Music, Playlist } from '@prisma/client';
import { playlistSelect } from 'src/utils/default-entities-select';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaylistDTO, userId: number): Promise<Playlist> {
    const { name, imgUrl } = data;

    try {
      console.log("Entrou aqui")
      const musics =
        data?.musics?.length > 0
          ? { connect: data.musics.map((id) => ({ id })) }
          : undefined;

      const playlist = await this.prisma.playlist.create({
        data: {
          name,
          userId,
          musics,
          imgUrl,
        },
        include: { musics: true },
      });

      console.log({ playlist });
      return playlist;
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number): Promise<Playlist> {
    return this.prisma.playlist.findFirst({
      where: { id },
      select: playlistSelect,
    }) as unknown as Playlist;
  }

  async findAll(params: any = {}): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({
      where: params,
      select: playlistSelect,
    }) as unknown as Playlist[];
  }

  async update(id: number, data: UpdatePlaylistDTO): Promise<Playlist> {
    try {
      const playlist: Playlist & { musics: Music[] } = (await this.findOne(
        Number(id),
      )) as Playlist & {
        musics: Music[];
      };
      const playlistMusicIds = playlist.musics.map((m) => m.id);
      const musicsToAdd = data.musics.filter(
        (id) => !playlistMusicIds.includes(id),
      );
      const musicsToRemove = playlistMusicIds.filter(
        (id) => !data.musics.includes(id),
      );

      return this.prisma.playlist.update({
        where: { id },
        data: {
          ...data,
          musics: {
            connect: musicsToAdd.map((id) => ({ id })),
            disconnect: musicsToRemove.map((id) => ({ id })),
          },
        },
        select: playlistSelect,
      }) as unknown as Playlist;
    } catch (err) {
      console.log(err.message);
    }
  }
}
