import { Post } from 'database/entities/Post';
import { ICreatePostDTO } from 'modules/accounts/dtos';
import { IUsersRepository } from 'modules/accounts/repositories/IUsersRepository';
import { IPostsRepository } from 'modules/posts/repositories/IPostsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreatePostUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    user_id,
    yt_url,
    title,
    description,
    is_private,
    is_active,
  }: ICreatePostDTO): Promise<Post> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const postFound = await this.postsRepository.findByYtUrl(yt_url);

    if (postFound) {
      throw new Error('Post already exists');
    }

    const post = await this.postsRepository.create({
      user_id,
      yt_url,
      title,
      description,
      is_private,
      is_active,
    });

    //TODO: send email to user
    //TODO: send email to all moderates
    return post;
  }
}
