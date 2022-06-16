import { prismaClient } from 'database';
import { Token } from 'database/entities/Token';
import { ICreateTokenDTO } from 'modules/accounts/dtos/UsersDTOs';
import { ITokensRepository } from '../ITokensRepository';

export class PrismaTokensRepository implements ITokensRepository {
  async findByToken(token: string): Promise<Token | null> {
    const tokenData = await prismaClient.token.findUnique({ where: { token } });
    return tokenData;
  }

  async findByUserId(userId: string): Promise<Token[]> {
    const tokens = await prismaClient.token.findMany({
      where: { user_id: userId },
    });
    return tokens;
  }

  async create({ user_id, id, token }: ICreateTokenDTO): Promise<void> {
    await prismaClient.token.create({
      data: { user_id, token },
    });
  }

  async revoke(id: string): Promise<void> {
    await prismaClient.token.update({
      where: { id },
      data: { is_revoked: true },
    });
  }

  async delete(id: string): Promise<void> {
    prismaClient.token.delete({ where: { id } });
  }
}
