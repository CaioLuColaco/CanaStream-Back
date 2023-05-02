export interface CreatePlaylistDTO {
  name: string;
  musics: number[];
}

export interface UpdatePlaylistDTO {
  name?: string;
  musics?: number[];
}
