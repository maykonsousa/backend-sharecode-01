import { Router } from 'express';
import { authenticateRoutes } from './athenticate.routes';
import { usersRoutes } from './users.routes';

export const router = Router();
router.use('/users', usersRoutes);
router.use('/auth', authenticateRoutes);
