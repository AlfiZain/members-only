import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import homeRouter from './routes/homeRouter.js';
import authRouter from './routes/authRouter.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from './db/pool.js';
import passport from 'passport';

import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 3000;
const PostgresStore = connectPgSimple(session);

app.set(
  'views',
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'),
);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentUser = req.user;

  next();
});

app.use('/auth', authRouter);
app.use('/', homeRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res
    .status(err.statusCode || 500)
    .send(err.message || 'Internal Server Error');
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(`Application running on port: ${PORT}`);
});
