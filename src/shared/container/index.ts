import { PrismaUsersRepository } from 'modules/accounts/repositories/implementations/PrismaUsersRepository';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  PrismaUsersRepository
);
