import { compare } from 'bcrypt';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

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
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
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

    return {
      user: {
        id: user.id,
        username: user.gh_username,
        email: user.email,
      },
      token,
    };
  }
}
