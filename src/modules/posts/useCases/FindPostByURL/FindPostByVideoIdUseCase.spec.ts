import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { PostsRepositoryInMemory } from 'modules/posts/repositories/inMemory/PostsRpositoryInMemory';
import { FindPostByVideoIdUseCase } from './FindPostByVideoIdUseCase';

let findPostByVideoIdUseCase: FindPostByVideoIdUseCase;
let postsRepository: PostsRepositoryInMemory;
let userRepository: UsersRepositoryInMemory;

const postData = {
  video_id: 'bOdrGg5oc3E',
  title: 'Algumas Dicas de CSS - Willian Justen',
  description:
    'Willian Faz uma revisão de um código CSS dando dicas fundamentais',
  is_private: true,
};

const userData = {
  gh_username: 'gh_username',
  name: 'Name Test',
  email: 'email@teste.com.br',
  password: '123456',
};
describe('FindPostByVideoIdUseCase', () => {
  beforeEach(async () => {
    postsRepository = new PostsRepositoryInMemory();
    userRepository = new UsersRepositoryInMemory();
    findPostByVideoIdUseCase = new FindPostByVideoIdUseCase(postsRepository);

    const user = await userRepository.create(userData);
    await postsRepository.create({ ...postData, user_id: `${user.id}` });
  });

  //without video_id
  it('should not be able to find a post without video_id', async () => {
    await expect(async () => {
      await findPostByVideoIdUseCase.execute('');
    }).rejects.toThrow('Youtube video ID is required');
  });

  //wrong video_id
  it('should not be able to find a post with a wrong video_id', async () => {
    await expect(async () => {
      await findPostByVideoIdUseCase.execute('123');
    }).rejects.toThrow('Post not found');
  });

  //correct video_id
  it('should be able to find a post with a correct video_id', async () => {
    const post = await findPostByVideoIdUseCase.execute(postData.video_id);
    expect(post).toHaveProperty('id');
  });
});
