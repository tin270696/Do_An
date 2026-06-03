import AppError from '../utils/app-error.js';
import Playlist from '../models/playlist.js';
import { sendEventToAllClients } from './sse-s.js';

function notifyNewPublicPlaylist(playlist, action) {
  sendEventToAllClients({
    type: 'public_playlist_new',
    action,
    playlist
  });
}

export async function getPlaylistById(playlistId) {
  const playlist = await Playlist.findById(playlistId);
  if(!playlist) {
    throw AppError.notFound('PLAYLIST_NOT_FOUND', 'Playlist not found');
  }
  return playlist;
}

export async function getPlaylistByUserId(userId) {
  const playlists = await Playlist.findByUserId(userId);
  return playlists;
}

export async function getSongsInPlaylist(playlistId) {
  const songs = await Playlist.getSongsInPlaylist(playlistId);
  return songs;
}

export async function addSongToPlaylist(playlistId, songId, sortOrder) {
  await Playlist.addSongToPlaylist(playlistId, songId, sortOrder);
}

export async function removeSongFromPlaylist(playlistId, songId) {
  await Playlist.removeSongFromPlaylist(playlistId, songId);
}

export async function createPlaylist(userId, playlistData) {
  const newPlaylist = await Playlist.create({ ... playlistData, user_id: userId });
  if(newPlaylist.is_public) {
    notifyNewPublicPlaylist(newPlaylist, 'created');
  }
  return newPlaylist;
}

export async function getPublicPlaylists() {
  const playlists = await Playlist.findPublic();
  return playlists;
}

export async function deletePlaylist(playlistId) {
  const currentPlaylist = await Playlist.findById(playlistId);
  if(!currentPlaylist) {
    throw AppError.notFound('PLAYLIST_NOT_FOUND', 'Playlist not found');
  }

  await Playlist.delete(playlistId);

  if(currentPlaylist.is_public) {
    notifyNewPublicPlaylist(currentPlaylist, 'deleted');
  }
}

export async function updatePlaylist(playlistId, playlistData) {
  const currentPlaylist = await Playlist.findById(playlistId);

  if(!currentPlaylist) {
    throw AppError.notFound('PLAYLIST_NOT_FOUND', 'Playlist not found');
  }

  const updatedPlaylist = await Playlist.update(playlistId, playlistData);
  if(updatedPlaylist.is_public && !currentPlaylist.is_public) {
    notifyNewPublicPlaylist(updatedPlaylist, 'made_public')
  }
  if(!updatedPlaylist.is_public && currentPlaylist.is_public) {
    notifyNewPublicPlaylist(updatedPlaylist, 'made_private')
  }

  return updatedPlaylist;
}