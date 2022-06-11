import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../CreateUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('AuthenticateUserUseCase', () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let creteUseruseCase: CreateUserUseCase;

  const userData = {
    name: 'Maykon Sousa',
    email: 'maykon.sousa@hotmail.com',
    password: '123456',
    gh_username: 'maykonsousa',
  };

  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    creteUseruseCase = new CreateUserUseCase(usersRepositoryInMemory);
    await creteUseruseCase.execute(userData);
  });

  it('should be able to authenticate user', async () => {
    const response = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });
    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate user with wrong email', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'wrong@email.com.br',
        password: '123456',
      });
    }).rejects.toThrow('Invalid credentials');
  });

  it('should not be able to authenticate user with wrong password', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: userData.email,
        password: 'wrong-password',
      });
    }).rejects.toThrow('Invalid credentials');
  });
});
