import { hash } from 'bcrypt';
import { ITokensRepository } from 'modules/accounts/repositories/ITokensRepository';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { IDateProvider } from 'shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from 'shared/container/providers/MailProvider/IMailProvider';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ResetPasswordUseCase {
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

  async execute(token: string, password: string): Promise<void> {
    //localiza o token
    const tokenData = await this.tokensRepository.findByToken(token);

    if (!tokenData) {
      throw new Error('Token does not exists');
    }
    //verifica se o token é do tipo reset

    if (tokenData.type !== 'reset') {
      throw new Error('Token is not valid');
    }

    //verifica se o token ainda não expirou
    const isExpired =
      this.dateProvider.compare({
        startDate: tokenData.expires_at,
        endDate: this.dateProvider.dateNow(),
        unit: 'minutes',
      }) > 0;
    if (isExpired) {
      throw new Error('Token expired');
    }

    //localiza o usuário pelo id do token
    const user = await this.usersRepository.findById(`${tokenData.user_id}`);

    if (!user) {
      throw new Error('User does not exists');
    }

    //verifica se a senha é válida
    if (password.length < 6) {
      throw new Error('Password is not valid');
    }
    //atualiza a senha do usuário
    const passwordHash = await hash(password, 8);

    await this.usersRepository.update(`${user.id}`, {
      ...user,
      password: passwordHash,
    });

    //deleta o token
    await this.tokensRepository.delete(`${tokenData.id}`);

    //envia email de notificação
    await this.mailProvider.sendMail({
      to: `${user.email}`,
      subject: 'Reset de Senha',
      body: `<p>Sua senha foi resetada com sucesso!</p>`,
    });
  }
}
