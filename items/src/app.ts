import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@itemseller/commonlib';

import { createItemRouter } from './routes/new';
import { showItemRouter } from './routes/show';
import { listItemRouter } from './routes/list';
import { updateItemRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createItemRouter);
app.use(showItemRouter);
app.use(listItemRouter);
app.use(updateItemRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
