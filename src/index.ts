import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes';
import error from './middlewares/error';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const port = process.env.PORT || 4000;

dotenv.config();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(clerkMiddleware());
app.get('/', (req, res) => {
  return res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', router);

app.use(error);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
