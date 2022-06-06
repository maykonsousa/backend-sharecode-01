import { Router } from 'express';

export const usersRoutes = Router();
usersRoutes.get('/', (req, res) => {
  res.send('Hello World!');
});
