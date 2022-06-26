import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPostsByStatusUseCase } from './FindPostsByStatusUseCase';

interface IRequest {
  status: 'active' | 'inactive';
  page: number;
  limit: number;
}

export class FindPostsByStatusController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { status, page, limit } = req.query;
    const findPostsByStatususeCase = container.resolve(
      FindPostsByStatusUseCase
    );
    try {
      const posts = await findPostsByStatususeCase.execute({
        status,
        page,
        limit,
      } as unknown as IRequest);
      return res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
