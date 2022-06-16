import { Token } from 'database/entities/Token';
import { ICreateTokenDTO } from '../dtos/UsersDTOs';

export interface ITokensRepository {
  findByToken(token: string): Promise<Token | null>;
  create({ token, id, user_id }: ICreateTokenDTO): Promise<void>;
  revoke(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
