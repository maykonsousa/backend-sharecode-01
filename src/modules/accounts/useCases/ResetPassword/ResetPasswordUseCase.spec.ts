import { randomUUID } from 'crypto';
import { TokensRepositoryInMemory } from 'modules/accounts/repositories/inMemory/TokensRepositoryInMemory';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { LuxonDateProvider } from 'shared/container/providers/DateProvider/implementations/LuxonDateProvider';
import { MailProviderInMemory } from 'shared/container/providers/MailProvider/inMemory/MailProviderInMemory';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { v4 as uuid } from 'uuid';
import { Token } from '../../../../database/entities/Token';

let usersRepository: UsersRepositoryInMemory;
let tokensRepository: TokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
let dateProvider: LuxonDateProvider;
let resetPasswordUseCase: ResetPasswordUseCase;
const userData = {
  gh_username: 'maykonsousa',
  name: 'Maykon Sousa',
  email: 'maykon.sousa@sharecode.com.br',
  password: '123456',
};
describe('ResetPasswordUseCase', () => {
  beforeAll(async () => {
    usersRepository = new UsersRepositoryInMemory();
    tokensRepository = new TokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();
    dateProvider = new LuxonDateProvider();
    resetPasswordUseCase = new ResetPasswordUseCase(
      usersRepository,
      tokensRepository,
      mailProvider,
      dateProvider
    );
  });

  it('Should not be able to reset passoword with a token inexistent', async () => {
    expect(async () => {
      await resetPasswordUseCase.execute('wrongtoken', '123456');
    }).rejects.toThrow('Token does not exist');
  });

  it('Should not be able to reset passoword with a token type not reset', async () => {
    const userCreated = await usersRepository.create(userData);
    await tokensRepository.create({
      user_id: `${userCreated.id}`,
      type: 'refresh',
      token: uuid(),
      expires_at: new Date(),
    });

    const token = await tokensRepository.findbyUser(
      `${userCreated.id}`,
      'refresh'
    );

    await expect(async () => {
      await resetPasswordUseCase.execute(`${token?.token}`, '123456');
    }).rejects.toThrow('Token is not valid');
  });

  it('Should not be able to reset passoword with a token expired', async () => {
    const userCreated = await usersRepository.create(userData);
    await tokensRepository.create({
      user_id: `${userCreated.id}`,
      type: 'reset',
      token: uuid(),
      expires_at: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    });

    const token = await tokensRepository.findbyUser(
      `${userCreated.id}`,
      'reset'
    );

    await expect(async () => {
      await resetPasswordUseCase.execute(`${token?.token}`, '123456');
    }).rejects.toThrow('Token expired');
  });

  it('Should not be able to reset token if user does not exists', async () => {
    await tokensRepository.create({
      user_id: `WrongUserId`,
      type: 'reset',
      token: uuid(),
      expires_at: dateProvider.addHours({
        date: dateProvider.dateNow(),
        value: 1,
      }),
    });

    const { token } = (await tokensRepository.findbyUser(
      'WrongUserId',
      'reset'
    )) as Token;
    await expect(async () => {
      await resetPasswordUseCase.execute(`${token}`, '123456');
    }).rejects.toThrow('User does not exists');
  });

  //password should be at least 6 characters
  it('Should not be able to reset passoword with a password less than 6 characters', async () => {
    const userCreated = await usersRepository.create(userData);
    await tokensRepository.create({
      user_id: `${userCreated.id}`,
      type: 'reset',
      token: uuid(),
      expires_at: dateProvider.addHours({
        date: dateProvider.dateNow(),
        value: 1,
      }),
    });

    const { token } = (await tokensRepository.findbyUser(
      `${userCreated.id}`,
      'reset'
    )) as Token;

    await expect(async () => {
      await resetPasswordUseCase.execute(`${token}`, '12345');
    }).rejects.toThrow('Password is not valid');
  });

  it('Should be able to reset passoword and send confirmation email', async () => {
    const userCreated = await usersRepository.create(userData);
    const sendMail = jest.spyOn(mailProvider, 'sendMail');
    const deleteToken = jest.spyOn(tokensRepository, 'delete');
    const updatePassword = jest.spyOn(usersRepository, 'update');
    await tokensRepository.create({
      user_id: `${userCreated.id}`,
      type: 'reset',
      token: 'teste de token',
      expires_at: dateProvider.addHours({
        date: dateProvider.dateNow(),
        value: 1,
      }),
    });

    const token = (await tokensRepository.findbyUser(
      `${userCreated.id}`,
      'reset'
    )) as Token;

    await resetPasswordUseCase.execute(`${token.token}`, '123456');
    expect(sendMail).toHaveBeenCalled();
    expect(deleteToken).toHaveBeenCalled();
    expect(updatePassword).toHaveBeenCalled();
  });
});
