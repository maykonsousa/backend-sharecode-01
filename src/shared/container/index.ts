import { container, delay } from 'tsyringe';
import { PrismaTokensRepository } from 'modules/accounts/repositories/implementations/PrismaTokensRepository';
import { PrismaUsersRepository } from 'modules/accounts/repositories/implementations/PrismaUsersRepository';
import { ITokensRepository } from 'modules/accounts/repositories/ITokensRepository';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { PrismaPostsRepository } from 'modules/posts/repositories/implementations/PrismaPostsRepository';
import { IPostsRepository } from 'modules/posts/repositories/IPostsRepository';
import './providers/DateProvider';
import './providers/MailProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => PrismaUsersRepository)
);

container.registerSingleton<ITokensRepository>(
  'TokensRepository',
  delay(() => PrismaTokensRepository)
);

container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  delay(() => PrismaPostsRepository)
);
