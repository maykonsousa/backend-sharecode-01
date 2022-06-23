import { Router } from 'express';
import { CreatePostController } from 'modules/posts/useCases/CreatePost/CreatePostController';
import { FindPostByIdController } from 'modules/posts/useCases/FindPostById/FindPostByIdController';
import { FindPostByVideoIdController } from 'modules/posts/useCases/FindPostByURL/FindPostByVideoIdController';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const postsRoutes = Router();

const createPostController = new CreatePostController();
const findPostByIdController = new FindPostByIdController();
const findPostByVideoIdController = new FindPostByVideoIdController();

postsRoutes.use(EnsureAuthenticated);
postsRoutes.post('/', createPostController.handle);
postsRoutes.get('/:id', findPostByIdController.handle);
postsRoutes.get('/video/:video_id', findPostByVideoIdController.handle);
