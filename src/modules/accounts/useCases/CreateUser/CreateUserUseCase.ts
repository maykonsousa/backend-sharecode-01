import { ICreateUserDTO } from '@modules/accounts/dtos/UsersDTOs';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUser } from 'database/entities/User';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}
  async execute({
    gh_username,
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<IUser> {
    const encryptedPassword = await hash(password, 8);
    console.log(encryptedPassword);
    const user = await this.usersRepository.create({
      gh_username,
      name,
      email,
      password,
    });

    return user;
  }
}
