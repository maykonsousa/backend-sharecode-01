import { User } from 'database/entities/User';
import { ICreateUserDTO, IUpdateUserDTO } from '../dtos/UsersDTOs';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: ICreateUserDTO): Promise<User>;
  update(id: string, data: IUpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
