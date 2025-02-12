import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes';
import error from './middlewares/error';


const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(express.json());

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

    