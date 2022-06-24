import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  user_id: string;
  type: 'admin' | 'user' | 'moderator';
}

@injectable()
export class SetUserTypeUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, type }: IRequest): Promise<void> {
    if (!user_id || !type) throw new Error('Invalid request');

    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) throw new Error('User not found');

    await this.usersRepository.update(user_id, { type });
  }
}
