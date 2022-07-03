import { Post } from 'database/entities/Post';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { IPostsRepository } from 'modules/posts/repositories/IPostsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FindPostsByUserUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(user_id: string): Promise<Post[]> {
    if (!user_id) {
      throw new Error('User id is required');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    const posts = await this.postsRepository.findByUserId(user_id);

    return posts;
  }
}
