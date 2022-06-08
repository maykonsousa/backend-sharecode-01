import { CreateUserController } from '@modules/accounts/useCases/CreateUser/CreateUserController';
import { Router } from 'express';

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post('/', createUserController.handle);
