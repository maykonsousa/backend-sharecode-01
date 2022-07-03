import { PostsRepositoryInMemory } from 'modules/posts/repositories/inMemory/PostsRpositoryInMemory';
import { FindPostsByStatusUseCase } from './FindPostsByStatusUseCase';
import { v4 as uuid } from 'uuid';

let findPostsByStatusUseCase: FindPostsByStatusUseCase;
let postsRepository: PostsRepositoryInMemory;

describe('FindPostsByStatusUseCase', () => {
  beforeEach(async () => {
    postsRepository = new PostsRepositoryInMemory();
    findPostsByStatusUseCase = new FindPostsByStatusUseCase(postsRepository);

    for (let i = 0; i < 53; i++) {
      await postsRepository.create({
        video_id: `${i}`,
        title: 'Ignite Lab | Aula 4 • Inscrição via GraphQL',
        description: 'Aula 04 do Ignite Lab Promovida pela RocketSeat',
        user_id: 'db39b139-b29b-48dd-9452-8dd008b7d631',

        is_private: false,
        is_active: true,
      });
    }
  });

  // filterByStatus
  it('should be able to filter posts by status', async () => {
    const result = await findPostsByStatusUseCase.execute({
      status: 'active',
      page: 1,
      limit: 20,
    });
    expect(result).toHaveLength(20);
    expect(result[0].video_id).toBe('0');
    expect(result[result.length - 1].video_id).toBe('19');
  });

  it('should be able to filter posts by status and page', async () => {
    const result = await findPostsByStatusUseCase.execute({
      status: 'active',
      page: 2,
      limit: 20,
    });
    expect(result).toHaveLength(20);
    expect(result[0].video_id).toBe('20');
    expect(result[result.length - 1].video_id).toBe('39');
  });

  it('should be able to filter posts by status and limit', async () => {
    const result = await findPostsByStatusUseCase.execute({
      status: 'active',
      page: 3,
      limit: 20,
    });
    expect(result).toHaveLength(13);
  });
});
