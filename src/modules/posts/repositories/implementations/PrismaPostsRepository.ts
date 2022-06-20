import { prismaClient } from 'database';
import { Post } from 'database/entities/Post';
import { ICreatePostDTO } from 'modules/accounts/dtos';
import { IPostsRepository } from '../IPostsRepository';

export class PrismaPostsRepository implements IPostsRepository {
  async findAll(): Promise<Post[]> {
    const posts = await prismaClient.posts.findMany();
    return posts;
  }

  async findById(id: string): Promise<Post | null> {
    const post = await prismaClient.posts.findUnique({ where: { id } });
    return post || null;
  }

  async findByYtUrl(yt_url: string): Promise<Post | null> {
    const post = await prismaClient.posts.findUnique({ where: { yt_url } });
    return post ? post : null;
  }

  async findByUserId(user_id: string): Promise<Post[]> {
    const posts = await prismaClient.posts.findMany({ where: { user_id } });
    return posts;
  }

  async create(data: ICreatePostDTO): Promise<Post> {
    const post = await prismaClient.posts.create({ data: data });
    return post;
  }

  async active(id: string): Promise<Post> {
    const post = await prismaClient.posts.update({
      where: { id },
      data: { is_active: true },
    });
    return post;
  }

  async inactive(id: string): Promise<Post> {
    const post = await prismaClient.posts.update({
      where: { id },
      data: { is_active: false },
    });
    return post;
  }

  async deleteByUser(id: string): Promise<void> {
    await prismaClient.posts.update({
      where: { id },
      data: { user_id: 'Admin' },
    });
  }

  async deleteByAdmin(id: string): Promise<void> {
    await prismaClient.posts.delete({ where: { id } });
  }

  async setPrivacy(id: string, is_private: boolean): Promise<Post> {
    const post = await prismaClient.posts.update({
      where: { id },
      data: { is_private },
    });
    return post;
  }
}
