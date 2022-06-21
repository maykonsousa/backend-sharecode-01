import { Router } from 'express';
import { CreatePostController } from 'modules/posts/useCases/CreatePost/CreatePostController';
import { FindPostByIdController } from 'modules/posts/useCases/FindPostById/FindPostByIdController';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const postsRoutes = Router();

const createPostController = new CreatePostController();
const findPostByIdController = new FindPostByIdController();

postsRoutes.use(EnsureAuthenticated);
postsRoutes.post('/', createPostController.handle);
postsRoutes.get('/:id', findPostByIdController.handle);
