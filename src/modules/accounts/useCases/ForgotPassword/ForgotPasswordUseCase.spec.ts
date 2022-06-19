import { TokensRepositoryInMemory } from 'modules/accounts/repositories/inMemory/TokensRepositoryInMemory';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { LuxonDateProvider } from 'shared/container/providers/DateProvider/implementations/LuxonDateProvider';
import { MailProviderInMemory } from 'shared/container/providers/MailProvider/inMemory/MailProviderInMemory';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

let forgotPassworUseCase: ForgotPasswordUseCase;
let usersRepository: UsersRepositoryInMemory;
let tokensRepository: TokensRepositoryInMemory;
let dateProvider: LuxonDateProvider;
let mailProvider: MailProviderInMemory;

describe('ForgotPasswordUseCase', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    tokensRepository = new TokensRepositoryInMemory();
    dateProvider = new LuxonDateProvider();
    mailProvider = new MailProviderInMemory();
    forgotPassworUseCase = new ForgotPasswordUseCase(
      usersRepository,
      tokensRepository,
      mailProvider,
      dateProvider
    );
  });

  it('Should be able to generete a reset password token', async () => {
    const generetedToken = jest.spyOn(tokensRepository, 'create');
    await usersRepository.create({
      gh_username: 'maykonsousa',
      name: 'Maykon Sousa',
      email: 'maykon.sousa@sharecode.com.br',
      password: '123456',
    });
    await forgotPassworUseCase.execute('maykon.sousa@sharecode.com.br');
    expect(generetedToken).toHaveBeenCalled();
  });

  it('Should be able to send forgot password email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      gh_username: 'maykonsousa',
      name: 'Maykon Sousa',
      email: 'maykon.sousa@sharecode.com.br',
      password: '123456',
    });

    await forgotPassworUseCase.execute('maykon.sousa@sharecode.com.br');
    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to send forgot password email with non-existing user', async () => {
    expect(async () => {
      await forgotPassworUseCase.execute('qualqueremail@teste.com.br');
    }).rejects.toThrow('User does not exists');
  });
});
