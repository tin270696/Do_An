import playlist from '../models/playlist.js';
import * as playlistService from '../services/playlist-s.js';
import { addClient, removeClient, sendInitialEvent } from '../services/sse-s.js';

// [GET] /api/v1/playlists/:id
export async function getPlaylistById(req, res) {
  try {
    const playlistId = req.params.id;
    const playlist = await playlistService.getPlaylistById(playlistId);
    return res.ok({ playlist });
  } catch (error) {
    return res.error(error);
  }
}

// [GET] /api/v1/playlists
export async function getPlaylists(req, res) {
  try {
    const playlists = await playlistService.getPlaylistByUserId(req.user.id);
    return res.ok({ playlists });
  } catch (error) {
    return res.error(error);
  }
}

// [GET] /api/v1/playlists/public
export async function getPublicPlaylists(req, res) {
  try {
    const playlists = await playlistService.getPublicPlaylists();
    return res.ok({ playlists });
  } catch (error) {
    return res.error(error);
  }
}

// [GET] /api/v1/playlists/public/new
export async function streamNewPublicPlaylists(req, res) {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeader?.();

    const client = addClient(res);
    sendInitialEvent(res, {
      type: "connected",
      message: "Connected to new public playlist events",
    });

    req.on("close", () => {
      removeClient(client.id);
    });
  } catch (error) {
    return res.error(error);
  }
}

// [POST] /api/v1/playlists
export async function createPlaylist(req, res) {
  try {
    const playlistData = req.validate.body;
    const newPlaylist = await playlistService.createPlaylist(
      req.user.id,
      playlistData,
    );
    return res.ok({ playlist: newPlaylist })
  } catch (error) {
    return res.error(error);
  }
}

// [GET] /api/v1/playlists/:id/songs
export async function getSongsInPlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    const songs = await playlistService.getSongsInPlaylist(playlistId);
    return res.ok({ songs })
  } catch (error) {
    return res.error(error);
  }
}

// [POST] /api/v1/playlists/:id/songs
export async function addSongToPlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    const { song_id, sort_order } = req.validate.body;
    await playlistService.addSongToPlaylist(playlistId, song_id, sort_order);
    const songs = await playlistService.getSongsInPlaylist(playlistId);
    return res.ok({ songs })
  } catch (error) {
    return res.error(error);
  }
}

// [DELETE] /api/v1/playlists/:id/songs/:songId
export async function removeSongFromPlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    const songId = req.params.songId;
    await playlistService.removeSongFromPlaylist(playlistId, songId);
    const songs = await playlistService.getSongsInPlaylist(playlistId);
    return res.ok({ songs })
  } catch (error) {
    return res.error(error);
  }
}

// [PUT] /api/v1/playlists/:id
// Body: { name?, description?, is_public? }
export async function updatePlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    const playlistData = req.validate.body;
    const updatedPlaylist = await playlistService.updatePlaylist(
      playlistId,
      playlistData,
    );
    return res.ok({ playlist: updatedPlaylist });
  } catch (error) {
    return res.error(error);
  }
}

// [DELETE] /api/v1/playlists/:id
export async function deletePlaylist(req, res) {
  try {
    const playlistId = req.params.id;
    await playlistService.deletePlaylist(playlistId);
    return res.ok({ message: "Playlist deleted successfully" });
  } catch (error) {
    return res.error(error);
  }
}