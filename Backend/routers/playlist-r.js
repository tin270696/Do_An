import express from 'express';
import * as playlistController from '../controllers/playlist-c.js';
import { protect, checkPlaylistOwnership, checkPlaylistPublic } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import { createPlaylistSchema, updatePlaylistSchema, addSongToPlaylistSchema, removeSongFromPlaylistSchema } from '../validators/playlist-chema.js';

const router = express.Router();

router.get('/public/new', playlistController.streamNewPublicPlaylists);

router.get('/public', playlistController.getPublicPlaylists);

router.get('/:id', checkPlaylistPublic, playlistController.getPlaylistById);

router.post('/', protect, validate(createPlaylistSchema), playlistController.createPlaylist);

router.put('/:id', protect, checkPlaylistOwnership, validate(updatePlaylistSchema), playlistController.updatePlaylist);

router.delete('/:id', protect, checkPlaylistOwnership, playlistController.deletePlaylist);

router.get('/', protect, playlistController.getPlaylists);

router.post('/:id/songs', protect, checkPlaylistOwnership, validate(addSongToPlaylistSchema), playlistController.addSongToPlaylist);

router.delete('/:id/songs/:songId', protect, checkPlaylistOwnership, validate(removeSongFromPlaylistSchema, 'params'), playlistController.removeSongFromPlaylist);

router.get('/:id/songs', checkPlaylistPublic, playlistController.getSongsInPlaylist);

export default router;