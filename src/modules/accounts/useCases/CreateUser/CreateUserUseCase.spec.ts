import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('CreateUserUseCase', () => {
  let usersRepositortInMemory: UsersRepositoryInMemory;
  let createUserUseCase: CreateUserUseCase;
  const userData = {
    name: 'Maykon Sousa',
    email: 'maykon.sousa@hotmail.com',
    gh_username: 'maykonsousa',
    password: '123456',
  };

  beforeEach(() => {
    usersRepositortInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositortInMemory);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute(userData);
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    await createUserUseCase.execute(userData);
    await expect(createUserUseCase.execute(userData)).rejects.toThrow(
      'User already exists'
    );
  });

  it('should not be able to create a new user with empty email', async () => {
    await expect(
      createUserUseCase.execute({ ...userData, email: '' })
    ).rejects.toThrow('Email is required');
  });
});
