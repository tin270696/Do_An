import express from 'express';
import cors from 'cors';
import errorMW from './middlewares/error-mw.js';
import responseMW from './middlewares/response-mw.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {engine} from 'express-handlebars';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, "views", 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

app.use(responseMW());

app.get('/favicon.ico', (req, res) => {
  return res.status(204).end();
})

// Routes
import authRouter from './routers/auth-r.js';
app.use('/api/v1/auth', authRouter);
import userRouter from './routers/user-r.js';
app.use('/api/v1/users', userRouter);
import songRouter from './routers/song-r.js';
app.use('/api/v1/songs', songRouter);
import playlistRouter from './routers/playlist-r.js';
app.use('/api/v1/playlists', playlistRouter);

app.get('/', (req, res) => {
  return res.redirect('/api-docs');
})

app.get('/api-docs', (req, res) => {
  return res.render('api-docs', {
    title: 'Media4Y API Docs',
    baseUrl: (process.env.BASE_URL || 'http://localhost:3443') + '/api/v1',
  });
});

app.use((req, res, next) => {
  return res.error({message: `Can't find ${req.originalUrl} on this server!`}, 404);
});

app.use(errorMW);
export default app;