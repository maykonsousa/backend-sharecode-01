import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPostByIdUseCase } from './FindPostByIdUseCase';

export class FindPostByIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const findPostByIdUseCase = container.resolve(FindPostByIdUseCase);
    try {
      const post = await findPostByIdUseCase.execute(id);
      return res.status(200).json(post);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
