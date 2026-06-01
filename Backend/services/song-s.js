import AppError from '../utils/app-error.js';
import Song from '../models/song.js';

export async function getSongById(songId) {
  const song = await Song.findById(songId);
  if(!song) {
    throw AppError.notFound('SONG_NOT_FOUND', 'Song not found');
  }
  return song;
}

export async function listSongs({ query }) {
  const filters = {
    q: query.q,
    genre: query.genre,
    artist: query.artist,
  };
  const limit = query.limit;
  const page = query.page;
  const offset = (page - 1) * limit;
  const {items, total} = await Song.all({filters, offset, limit});
  return {
    items,
    meta: {
      total,
      limit,
      page,
      totalPages: Math.ceil(total/limit) || 0,
    }
  };
}

export async function getSongsByGenre(genre) {
  const songs = await Song.findByGenre(genre);
  return songs;
}

export async function getSongsByArtist(artist) {
  const songs = await Song.findByArtist(artist);
  return songs;
}

export async function getSongsByTitle(title) {
  const songs = await Song.findByTitle(title);
  if(!songs) {
    throw AppError.notFound('SONGS_NOT_FOUND', 'Songs not found');
  }
  return songs;
}