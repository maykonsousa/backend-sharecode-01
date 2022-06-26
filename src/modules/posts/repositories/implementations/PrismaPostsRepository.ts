import { prismaClient } from 'database';
import { Post } from 'database/entities/Post';
import { ICreatePostDTO } from 'modules/accounts/dtos';
import { IPostsRepository } from '../IPostsRepository';

interface IRequestStatus {
  status: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export class PrismaPostsRepository implements IPostsRepository {
  async findByStatus({
    status,
    page = 1,
    limit = 20,
  }: IRequestStatus): Promise<Post[]> {
    const posts = await prismaClient.posts.findMany({
      where: { is_active: status === 'active' ? true : false },
      skip: page * limit,
      take: limit,
      include: { User: true },
    });
    return posts;
  }

  async findById(id: string): Promise<Post | null> {
    const post = await prismaClient.posts.findFirst({
      where: { id, is_active: true },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            gh_username: true,
          },
        },
      },
    });
    return post || null;
  }

  async findByVideoId(video_id: string): Promise<Post | null> {
    const post = await prismaClient.posts.findFirst({
      where: { video_id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            gh_username: true,
          },
        },
      },
    });
    return post ? post : null;
  }

  async findByUserId(user_id: string): Promise<Post[]> {
    const posts = await prismaClient.posts.findMany({
      where: { user_id, is_active: true },
    });
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
