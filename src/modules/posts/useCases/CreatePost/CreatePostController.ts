import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreatePostUseCase } from './CreatePostUseCase';

export class CreatePostController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { yt_url, title, description, is_private, is_active } = req.body;
    const { id: user_id } = req.user;
    const createPostUseCase = container.resolve(CreatePostUseCase);
    try {
      const post = await createPostUseCase.execute({
        user_id,
        yt_url,
        title,
        description,
        is_private,
        is_active,
      });
      return res.status(201).json(post);
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
