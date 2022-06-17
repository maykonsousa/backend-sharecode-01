import { PrismaTokensRepository } from 'modules/accounts/repositories/implementations/PrismaTokensRepository';
import { PrismaUsersRepository } from 'modules/accounts/repositories/implementations/PrismaUsersRepository';
import { ITokensRepository } from 'modules/accounts/repositories/ITokensRepository';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { container } from 'tsyringe';
import './providers/DateProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  PrismaUsersRepository
);

container.registerSingleton<ITokensRepository>(
  'TokensRepository',
  PrismaTokensRepository
);
