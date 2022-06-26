import { Post } from 'database/entities/Post';

interface IRequestStatus {
  status: 'active' | 'inactive';
  page?: number;
  limit?: number;
}
export interface IPostsRepository {
  findByStatus({ status, page, limit }: IRequestStatus): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  findByVideoId(id: string): Promise<Post | null>;
  findByUserId(user_id: string): Promise<Post[]>;
  create(data: Post): Promise<Post>;
  active(id: string): Promise<Post>;
  inactive(id: string): Promise<Post>;
  deleteByUser(id: string): Promise<void>;
  deleteByAdmin(id: string): Promise<void>;
  setPrivacy(id: string, isPrivate: boolean): Promise<Post>;
}
