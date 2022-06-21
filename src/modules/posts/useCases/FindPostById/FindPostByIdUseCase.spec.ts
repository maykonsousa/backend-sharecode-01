import { Post } from 'database/entities/Post';
import { PostsRepositoryInMemory } from 'modules/posts/repositories/inMemory/PostsRpositoryInMemory';
import { FindPostByIdUseCase } from './FindPostByIdUseCase';

let post: Post;
let postsRepository: PostsRepositoryInMemory;
let findPostByIdUseCase: FindPostByIdUseCase;

const postData = {
  yt_url: 'https://www.youtube.com/watch?v=bOdrGg5oc3E',
  title: 'Algumas Dicas de CSS - Willian Justen',
  description:
    'Willian Faz uma revisão de um código CSS dando dicas fundamentais',
  user_id: '041c4904-b415-48d3-bb4a-08aa3906c205',
  is_active: true,
};

describe('FindPostByIdUseCase', () => {
  beforeEach(async () => {
    postsRepository = new PostsRepositoryInMemory();
    findPostByIdUseCase = new FindPostByIdUseCase(postsRepository);
    post = await postsRepository.create(postData);
  });

  it('should be able to find a post active by id', async () => {
    const postFound = await findPostByIdUseCase.execute(`${post.id}`);
    expect(postFound).toHaveProperty('id');
  });
  it('should  not be able to find a post inactive by id', async () => {
    const postInactive = await postsRepository.create({
      ...postData,
      is_active: false,
    });
    await expect(async () => {
      await findPostByIdUseCase.execute(`${postInactive.id}`);
    }).rejects.toThrow('Post not found');
  });

  it('should  not be able to find a post by id not found', async () => {
    await expect(async () => {
      await findPostByIdUseCase.execute('id-not-found');
    }).rejects.toThrow('Post not found');
  });
});
