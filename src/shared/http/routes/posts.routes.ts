import { Router } from 'express';
import { CreatePostController } from 'modules/posts/useCases/CreatePost/CreatePostController';
import { FindPostByIdController } from 'modules/posts/useCases/FindPostById/FindPostByIdController';
import { FindPostByVideoIdController } from 'modules/posts/useCases/FindPostByURL/FindPostByVideoIdController';
import { FindPostsByUserController } from 'modules/posts/useCases/FindPostByUser/FindPostByuserController';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const postsRoutes = Router();

const createPostController = new CreatePostController();
const findPostByIdController = new FindPostByIdController();
const findPostByVideoIdController = new FindPostByVideoIdController();
const findPostsByUserController = new FindPostsByUserController();

postsRoutes.use(EnsureAuthenticated);
postsRoutes.post('/', createPostController.handle);
postsRoutes.get('/user/:user_id', findPostsByUserController.handle);
postsRoutes.get('/:id', findPostByIdController.handle);
postsRoutes.get('/video/:video_id', findPostByVideoIdController.handle);
