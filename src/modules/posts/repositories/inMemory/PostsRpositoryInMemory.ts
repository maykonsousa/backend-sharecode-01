import { Post } from 'database/entities/Post';
import { ICreatePostDTO } from 'modules/accounts/dtos';
import { IPostsRepository, IRequestStatus } from '../IPostsRepository';

export class PostsRepositoryInMemory implements IPostsRepository {
  posts: Post[] = [];

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async findById(id: string): Promise<Post | null> {
    const post = this.posts.find((post) => post.id === id && post.is_active);
    return post || null;
  }

  async findByVideoId(video_id: string): Promise<Post | null> {
    const post = this.posts.find((post) => post.video_id === video_id);
    return post || null;
  }

  async findByUserId(user_id: string): Promise<Post[]> {
    return this.posts.filter(
      (post) => post.user_id === user_id && post.is_active
    );
  }

  async create(data: ICreatePostDTO): Promise<Post> {
    const post = new Post();
    Object.assign(post, data);
    this.posts.push(post);
    return post;
  }

  async active(id: string): Promise<Post> {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    const post = this.posts[postIndex];
    Object.assign(post, { is_active: true });
    return post;
  }
  async inactive(id: string): Promise<Post> {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    const post = this.posts[postIndex];
    Object.assign(post, { is_active: false });
    return post;
  }

  async deleteByUser(id: string): Promise<void> {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    const post = this.posts[postIndex];
    Object.assign(post, { user_id: 'Admin' });
  }

  async deleteByAdmin(id: string): Promise<void> {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(postIndex, 1);
  }
  async setPrivacy(id: string, is_private: boolean): Promise<Post> {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    const post = this.posts[postIndex];
    Object.assign(post, { is_private });
    return post;
  }

  async findByStatus({
    page = 1,
    limit = 20,
    status,
  }: IRequestStatus): Promise<Post[]> {
    const start = (page - 1) * limit;
    const end = page * limit;
    const posts = this.posts
      .filter((post) => post.is_active === (status === 'active'))
      .slice(start, end);
    return posts;
  }
}
