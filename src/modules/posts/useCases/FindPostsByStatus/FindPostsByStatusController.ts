import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPostsByStatusUseCase, IRequest } from './FindPostsByStatusUseCase';

export class FindPostsByStatusController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { status, page = 1, limit = 20 } = req.query;
    const pageParsed = parseInt(page as string);
    const limitParsed = parseInt(limit as string);

    try {
      const findPostsByUserUseCase = container.resolve(
        FindPostsByStatusUseCase
      );
      const posts = await findPostsByUserUseCase.execute({
        status,
        page: pageParsed,
        limit: limitParsed,
      } as IRequest);
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
