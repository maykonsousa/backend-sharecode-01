import { prismaClient } from 'database';
import { Token } from 'database/entities/Token';
import { ICreateTokenDTO } from 'modules/accounts/dtos/UsersDTOs';
import { ITokensRepository } from '../ITokensRepository';

export class PrismaTokensRepository implements ITokensRepository {
  async create({
    token,
    type,
    user_id,
    expires_at,
  }: ICreateTokenDTO): Promise<void> {
    await prismaClient.token.create({
      data: { token, type, user_id, is_revoked: false, expires_at },
    });
  }
  async findByToken(token: string): Promise<Token | null> {
    const tokenData =
      (await prismaClient.token.findUnique({
        where: { token },
      })) ?? null;
    return tokenData;
  }
  async findbyUser(user_id: string, type: string): Promise<Token | null> {
    const tokenData = await prismaClient.token.findFirst({
      where: { user_id, type },
    });
    return tokenData;
  }
  async delete(id: string): Promise<void> {
    await prismaClient.token.delete({ where: { id } });
  }
}
