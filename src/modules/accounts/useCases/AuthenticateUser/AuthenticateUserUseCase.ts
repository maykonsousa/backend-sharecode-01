import { compare } from 'bcrypt';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { ITokensRepository } from 'modules/accounts/repositories/ITokensRepository';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('TokensRepository')
    private tokenRepository: ITokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = sign({}, `${process.env.TOKEN_SECRET}`, {
      subject: user.id,
      expiresIn: `${process.env.TOKEN_EXPIRES_IN}`,
    });

    const refreshToken = uuid();

    const oldRefreshToken = await this.tokenRepository.findbyUser(
      user.id as string,
      'refresh'
    );

    if (oldRefreshToken) {
      await this.tokenRepository.delete(oldRefreshToken.id as string);
    }

    const expires_at = this.dateProvider.add({
      date: this.dateProvider.dateNow(),
      value: 30,
    });

    console.log('expires_at', expires_at);

    await this.tokenRepository.create({
      token: refreshToken,
      type: 'refresh',
      user_id: `${user.id}`,
      expires_at,
    });

    return {
      user: {
        id: `${user.id}`,
        username: user.gh_username,
        email: user.email,
      },
      token,
      refreshToken,
    };
  }
}
