import { Router } from 'express';
import { CreatePostController } from 'modules/posts/useCases/CreatePost/CreatePostController';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const postsRoutes = Router();

const createPostController = new CreatePostController();

postsRoutes.use(EnsureAuthenticated);
postsRoutes.post('/', createPostController.handle);
