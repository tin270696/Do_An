import db from '../db/db.js';
const TABLE_NAME = 'songs';
const dbInstance = db(TABLE_NAME);

function applyFilters(qb, {q, genre, artist}) {
  if(q) {
    qb.andWhere((inner) => {
      inner.whereRaw("title ILIKE ?", [`%${q}%`]);
    });
  }

  if(genre) qb.andWhereRaw("genre ILIKE ?", [genre]);
  if(artist) qb.andWhereRaw("artist ILIKE ?", [artist]);
}

export default  {
  all: async({ filters, fields, offset, limit }) => {
    const base = dbInstance.clone().modify(applyFilters, filters);

    const [{count}] = await base.clone().count({ count : '*' });
    const total = Number(count) || 0;

    const cols = (fields?.length ? fields : ["*"]);
    const items = await base.clone().select(cols).limit(limit).offset(offset);

    return {items, total};
  },
  findById: async (id) => {
    return  dbInstance.clone().where({id}).first();
  },
  findByTitle: async (title) => {
    return  dbInstance.clone().where({title}).first();
  },
  findByArtist: async (artist) => {
    return  dbInstance.clone().where({artist}).first();
  },
  findByGenre: async (genre) => {
    return  dbInstance.clone().where({genre}).select('*');
  },
};