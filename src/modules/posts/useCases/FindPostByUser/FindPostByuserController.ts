import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPostsByUserUseCase } from './FindPostByUserUseCase';

export class FindPostsByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.params.user_id || req.user.id;

    try {
      const findPostsByUserUseCase = container.resolve(FindPostsByUserUseCase);
      const posts = await findPostsByUserUseCase.execute(userId);
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      return res.status(500).json({ error: 'Unexpected error' });
    }
  }
}
