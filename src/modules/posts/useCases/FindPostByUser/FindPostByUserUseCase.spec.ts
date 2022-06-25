import { User } from 'database/entities/User';
import { ICreateUserDTO } from 'modules/accounts/dtos/UsersDTOs';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { PostsRepositoryInMemory } from 'modules/posts/repositories/inMemory/PostsRpositoryInMemory';
import { FindPostsByUserUseCase } from './FindPostByUserUseCase';

let findPostsByUserUseCase: FindPostsByUserUseCase;
let postsRepository: PostsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;

const userData: ICreateUserDTO = {
  gh_username: 'test',
  name: 'test',
  email: 'teste@teste.com.br',
  password: 'teste123',
};

let user: User;

describe('FindPostsByUserUseCase', () => {
  beforeEach(async () => {
    postsRepository = new PostsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    findPostsByUserUseCase = new FindPostsByUserUseCase(
      postsRepository,
      usersRepository
    );
    user = await usersRepository.create(userData);
    await postsRepository.create({
      video_id: 'RmcQ5NxB5Gs',
      title: 'Ignite Lab | Aula 4 • Inscrição via GraphQL',
      description: 'Aula 04 do Ignite Lab Promovida pela RocketSeat',
      user_id: `${user.id}`,
      is_active: true,
    });

    await postsRepository.create({
      video_id: 'RmcQ5NxB5Gt',
      title: 'Título video inativo',
      description: 'Descrição vídeo inativo',
      user_id: `${user.id}`,
    });
  });

  //without user_id
  it('should throw an error if user_id is not provided', async () => {
    await expect(findPostsByUserUseCase.execute('')).rejects.toThrow(
      'User id is required'
    );
  });

  //user not found
  it('should throw an error if user not found', async () => {
    await expect(findPostsByUserUseCase.execute('123')).rejects.toThrow(
      'User not found'
    );
  });

  //only active posts
  it('should return only active posts', async () => {
    const posts = await findPostsByUserUseCase.execute(`${user.id}`);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Ignite Lab | Aula 4 • Inscrição via GraphQL');
  });
});
