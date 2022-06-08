import { IUsersRepository } from '../IUsersRepository';
import { prismaClient } from '../../../../database';
import { IUser } from 'database/entities/User';
import {
  ICreateUserDTO,
  IUpdateUserDTO,
} from '@modules/accounts/dtos/UsersDTOs';

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prismaClient.user.findMany();
    return user[0];
  }
  async findAll(): Promise<IUser[]> {
    const users = await prismaClient.user.findMany();
    return users;
  }
  async findById(id: string): Promise<IUser | null> {
    const user = await prismaClient.user.findUnique({ where: { id } });
    return user;
  }

  async create({
    gh_username,
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<IUser> {
    const newUser = await prismaClient.user.create({
      data: { gh_username, name, email, password },
    });
    return newUser;
  }
  async update(id: string, data: IUpdateUserDTO): Promise<IUser> {
    return prismaClient.user.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    prismaClient.user.delete({ where: { id } });
  }
}
