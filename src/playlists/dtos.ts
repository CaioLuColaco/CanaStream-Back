export interface CreatePlaylistDTO {
  name: string;
  musics: number[];
  imgUrl?: string;
}

export interface UpdatePlaylistDTO {
  name?: string;
  musics?: number[];
}
