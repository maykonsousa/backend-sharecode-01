import { ITokensRepository } from 'modules/accounts/repositories/ITokensRepository';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from 'shared/container/providers/MailProvider/IMailProvider';
import { inject, injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('TokensRepository')
    private tokensRepository: ITokensRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(email: string): Promise<string> {
    //localiza usuário
    const user = await this.usersRepository.findByEmail(email);

    //verifica se usuário existe
    if (!user) {
      throw new Error('User does not exists');
    }

    const token = uuid();
    const expires_at = this.dateProvider.addHours({
      date: this.dateProvider.dateNow(),
      value: 1,
    });

    await this.tokensRepository.create({
      user_id: `${user.id}`,
      token,
      expires_at,
      type: 'reset',
    });

    //envia email com token
    await this.mailProvider.sendMail({
      to: `${user.email}`,
      subject: 'Reset de Senha',
      body: `<p>Para resetar sua senha, clique no link abaixo:
      <a href="http://localhost:3000/reset?token=${token}">Resetar Senha</a></p>`,
    });

    return token;
  }
}
