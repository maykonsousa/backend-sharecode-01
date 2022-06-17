import { Token } from 'database/entities/Token';
import { ICreateTokenDTO } from '../dtos/UsersDTOs';

export interface ITokensRepository {
  create({ token, type, user_id, expires_at }: ICreateTokenDTO): Promise<void>;
  findByToken(token: string): Promise<Token | null>;
  findbyUser(user_id: string, type: string): Promise<Token | null>;
  delete(id: string): Promise<void>;
}
