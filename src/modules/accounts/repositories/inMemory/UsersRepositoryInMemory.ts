import { User } from '../../../../database/entities/User';
import {
  ICreateUserDTO,
  IUpdateUserDTO,
} from 'modules/accounts/dtos/UsersDTOs';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];
  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user ? user : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user ? user : null;
  }
  async create({
    name,
    email,
    gh_username,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { name, email, password, gh_username });
    this.users.push(user);
    return user;
  }
  async update(id: string, { password }: IUpdateUserDTO): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    const user = this.users[userIndex];
    Object.assign(user, { password });
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<User[]> {
    return this.users;
  }
}
