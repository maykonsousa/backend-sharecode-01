import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { router } from './routes';

import '../container/index';

export const app = express();
app.use(express.json());
app.use(router);
