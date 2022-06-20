import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { router } from './routes';

import '../container/index';

const app = express();
app.use(express.json());
app.use(router);

export { app };
