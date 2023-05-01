export const userSelect = {
  id: true,
  email: true,
  username: true,
  password: false,
};

export const artistSelect = {
  name: true,
};

export const musicSelect = {
  id: true,
  name: true,
  url: true,
  artist: { select: artistSelect },
};

export const playlistSelect = {
  id: true,
  name: true,
  user: { select: userSelect },
  musics: { select: musicSelect },
};
