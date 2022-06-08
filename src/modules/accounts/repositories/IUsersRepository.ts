import { IUser } from 'database/entities/User';
import { ICreateUserDTO, IUpdateUserDTO } from '../dtos/UsersDTOs';

export interface IUsersRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUserDTO): Promise<IUser>;
  update(id: string, data: IUpdateUserDTO): Promise<IUser>;
  delete(id: string): Promise<void>;
}
