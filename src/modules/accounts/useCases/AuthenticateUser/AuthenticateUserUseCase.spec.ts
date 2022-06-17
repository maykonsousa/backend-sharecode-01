import { TokensRepositoryInMemory } from 'modules/accounts/repositories/inMemory/TokensRepositoryInMemory';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { LuxonDateProvider } from 'shared/container/providers/DateProvider/implementations/LuxonDateProvider';
import { CreateUserUseCase } from '../CreateUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

describe('AuthenticateUserUseCase', () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let tokensRepositoryInMemory: TokensRepositoryInMemory;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let dateProvider: LuxonDateProvider;
  let creteUseruseCase: CreateUserUseCase;

  const userData = {
    name: 'Maykon Sousa',
    email: 'maykon.sousa@hotmail.com',
    password: '123456',
    gh_username: 'maykonsousa',
  };

  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    tokensRepositoryInMemory = new TokensRepositoryInMemory();
    dateProvider = new LuxonDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      tokensRepositoryInMemory,
      dateProvider
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
