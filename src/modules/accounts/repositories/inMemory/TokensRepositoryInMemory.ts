import { ICreateTokenDTO } from 'modules/accounts/dtos/UsersDTOs';
import { Token } from '../../../../database/entities/Token';
import { ITokensRepository } from '../ITokensRepository';

export class TokensRepositoryInMemory implements ITokensRepository {
  tokens: Token[] = [];
  async create({
    token,
    type,
    user_id,
    expires_at,
  }: ICreateTokenDTO): Promise<void> {
    const newToken = new Token();
    Object.assign(newToken, { token, type, user_id, expires_at });
    this.tokens.push(newToken);
  }
  async findByToken(token: string): Promise<Token | null> {
    const tokenFound = this.tokens.find((t) => t.token === token) ?? null;
    return tokenFound;
  }
  async findbyUser(user_id: string, type: string): Promise<Token | null> {
    const tokenFound =
      this.tokens.find((t) => t.user_id === user_id && t.type === type) ?? null;
    return tokenFound;
  }
  async delete(id: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex((t) => t.id === id);
    this.tokens.splice(tokenIndex, 1);
  }
}
