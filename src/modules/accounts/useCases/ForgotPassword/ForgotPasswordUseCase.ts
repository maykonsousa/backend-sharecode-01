import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(email: string): Promise<void> {
    //localiza usuário
    //verifica se usuário existe
    //gera token
    //envia email com token
    //salva token no banco
  }
}
