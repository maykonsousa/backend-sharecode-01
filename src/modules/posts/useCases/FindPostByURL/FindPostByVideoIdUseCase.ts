import { IPostsRepository } from 'modules/posts/repositories/IPostsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FindPostByVideoIdUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository
  ) {}

  async execute(video_id: string) {
    if (!video_id) {
      throw new Error('Youtube video ID is required');
    }
    const post = await this.postsRepository.findByVideoId(video_id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}
