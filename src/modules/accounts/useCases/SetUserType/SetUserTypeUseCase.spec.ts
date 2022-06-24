import { ICreateUserDTO } from 'modules/accounts/dtos/UsersDTOs';
import { UsersRepositoryInMemory } from 'modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { SetUserTypeUseCase } from './SetUserTypeUseCase';

let setUserTypeUseCase: SetUserTypeUseCase;
let usersRepository: UsersRepositoryInMemory;

const userData: ICreateUserDTO = {
  gh_username: 'test',
  name: 'test',
  email: 'teste@teste.com.br',
  password: 'test123',
};

describe('SetUserTypeUseCase', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    setUserTypeUseCase = new SetUserTypeUseCase(usersRepository);
  });

  //without user
  it('should throw an error if user id or type is not provided', async () => {
    await expect(async () => {
      await setUserTypeUseCase.execute({
        user_id: '',
        type: 'admin',
      });
    }).rejects.toThrow('Invalid request');
  });

  it('should throw an error if user is not found', async () => {
    await expect(async () => {
      await setUserTypeUseCase.execute({
        user_id: 'test',
        type: 'admin',
      });
    }).rejects.toThrow('User not found');
  });

  it('Should be able to set user type', async () => {
    const userCreated = await usersRepository.create(userData);
    await setUserTypeUseCase.execute({
      user_id: `${userCreated.id}`,
      type: 'admin',
    });
    const userFound = await usersRepository.findById(`${userCreated?.id}`);
    expect(userFound?.type).toBe('admin');
  });
});
