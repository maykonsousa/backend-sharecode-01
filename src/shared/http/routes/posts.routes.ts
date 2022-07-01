import { Router } from 'express';
import { CreatePostController } from 'modules/posts/useCases/CreatePost/CreatePostController';
import { FindPostByIdController } from 'modules/posts/useCases/FindPostById/FindPostByIdController';
import { FindPostByVideoIdController } from 'modules/posts/useCases/FindPostByURL/FindPostByVideoIdController';
import { FindPostsByUserController } from 'modules/posts/useCases/FindPostByUser/FindPostByuserController';
import { FindPostsByStatusController } from 'modules/posts/useCases/FindPostsByStatus/FindPostsByStatusController';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const postsRoutes = Router();

const createPostController = new CreatePostController();
const findPostByIdController = new FindPostByIdController();
const findPostByVideoIdController = new FindPostByVideoIdController();
const findPostsByUserController = new FindPostsByUserController();
const findPostsByStatus = new FindPostsByStatusController();

postsRoutes.use(EnsureAuthenticated); // verifica se está autenticado
postsRoutes.post('/', createPostController.handle); // cria um post
postsRoutes.get('/id/:id', findPostByIdController.handle); // busca um post por id
postsRoutes.get('/user', findPostsByUserController.handle); // busca posts do usuário logado
postsRoutes.get('/user/:user_id', findPostsByUserController.handle); // busca posts por usuário
postsRoutes.get('/status', findPostsByStatus.handle); // busca posts por status
postsRoutes.get('/video/:video_id', findPostByVideoIdController.handle); // busca posts por id do vídeo do youtube
