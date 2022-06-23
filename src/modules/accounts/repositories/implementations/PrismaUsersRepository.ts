import { IUsersRepository } from '../IUsersRepository';
import { prismaClient } from '../../../../database';
import { User } from 'database/entities/User';
import {
  ICreateUserDTO,
  IUpdateUserDTO,
} from 'modules/accounts/dtos/UsersDTOs';

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = (await prismaClient.user.findUnique({
      where: { email },
    })) as User;
    return user;
  }
  async findAll(): Promise<User[]> {
    const users = (await prismaClient.user.findMany()) as User[];
    return users;
  }
  async findById(id: string): Promise<User | null> {
    const user = (await prismaClient.user.findUnique({
      where: { id },
    })) as User;
    return user;
  }

  async create({
    gh_username,
    name,
    email,
    password,
    type,
  }: ICreateUserDTO): Promise<User> {
    const newUser = (await prismaClient.user.create({
      data: { gh_username, name, email, password, type },
    })) as User;
    return newUser;
  }
  async update(id: string, data: IUpdateUserDTO): Promise<void> {
    await prismaClient.user.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }
}
