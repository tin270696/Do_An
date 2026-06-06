import db from '../db/db.js';
const TABLE_NAME = 'playlists';
const dbInstance = db(TABLE_NAME);

export default  {
  all: async() => {
    return dbInstance.clone().select("*");
  },
  findPublic: async () => {
    return  dbInstance.clone().where({ is_public: true }).select('*');
  },
  findById: async (id) => {
    return  dbInstance.clone().where({id}).first();
  },
  findByName: async (name) => {
    return  dbInstance.clone().where({name}).first();
  },
  findByUserId: async (user_id) => {
    return  dbInstance.clone().where({user_id}).select('*');
  },
  getSongsInPlaylist: async (playlist_id) => {
    return db('playlist_songs')
      .join('songs', 'playlist_songs.song_id', 'songs.id')
      .where({playlist_id})
      .select('songs.*');
  },
  addSongToPlaylist: async (playlist_id, song_id, sort_order) => {
    const existing = await db('playlist_songs').where({ playlist_id, song_id }).first();

    if(existing) {
      throw new Error('Song already exists in playlist');
    }

    return db('playlist_songs').insert({
      playlist_id,
      song_id,
      sort_order
    });
  },
  removeSongFromPlaylist: async (playlist_id, song_id) => {
    const existing = await db('playlist_songs').where({ playlist_id, song_id }).first();

    if(!existing) {
      throw new Error('Song not found in playlist');
    }

    return db('playlist_songs').where({ playlist_id, song_id }).del();
  },
  create: async (playlistData) => {
    const [newPlaylist] = await dbInstance.clone().insert(playlistData).returning('*');
    return newPlaylist;
  },
  delete: async (id) => {
    return dbInstance.clone().where({ id }).del();
  },
  update: async (id, playlistData) => {
    const [updatedPlaylist] = await dbInstance.clone().where({ id }).update(playlistData).returning('*');
    return updatedPlaylist;
  }
};