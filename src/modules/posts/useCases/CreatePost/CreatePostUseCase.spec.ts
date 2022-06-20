import { User } from 'database/entities/User';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { PostsRepositoryInMemory } from 'modules/posts/repositories/inMemory/PostsRpositoryInMemory';
import { CreatePostUseCase } from './CreatePostUseCase';

let createPostUseCase: CreatePostUseCase;
let postsRepository: PostsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let user: User;
describe('CreatePostUseCase', () => {
  beforeEach(async () => {
    postsRepository = new PostsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createPostUseCase = new CreatePostUseCase(postsRepository, usersRepository);
    user = await usersRepository.create({
      gh_username: 'maykonsousa',
      name: 'Maykon Sousa',
      email: 'maykon.sousa@hotmail.com',
      password: '123456',
    });
  });

  it('should be able to create a post', async () => {
    const post = await createPostUseCase.execute({
      user_id: `${user.id}`,
      yt_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Titulo do video',
      description: 'Descrição do video',
      is_private: false,
    });

    expect(post).toHaveProperty('id');
  });

  it('should not be able to create a post with a invalid user_id', async () => {
    await expect(
      createPostUseCase.execute({
        user_id: 'invalid_id',
        yt_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Titulo do video',
        description: 'Descrição do video',
        is_private: false,
      })
    ).rejects.toBeInstanceOf(Error);
  });
  //same the yt_url is already registered
  it('Should not be able to create a post when the yt_url is already registered', async () => {
    await createPostUseCase.execute({
      user_id: `${user.id}`,
      yt_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Titulo do video',
      description: 'Descrição do video',
      is_private: false,
    });

    await expect(
      createPostUseCase.execute({
        user_id: `${user.id}`,
        yt_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Titulo do video',
        description: 'Descrição do video',
        is_private: false,
      })
    ).rejects.toThrow('Post already exists');
  });
});
