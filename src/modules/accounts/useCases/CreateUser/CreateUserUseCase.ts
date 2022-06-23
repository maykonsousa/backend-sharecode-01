import { User } from 'database/entities/User';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { ICreateUserDTO } from 'modules/accounts/dtos/UsersDTOs';

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
    type,
  }: ICreateUserDTO): Promise<User> {
    if (!email) {
      throw new Error('Email is required');
    }
    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const encryptedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      gh_username,
      name,
      email,
      password: encryptedPassword,
      type,
    });

    return user;
  }
}
