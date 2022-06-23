import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindPostByVideoIdUseCase } from './FindPostByVideoIdUseCase';

export class FindPostByVideoIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { video_id } = req.params;
    console.log(video_id);
    const findPostByVideoIdUseCase = container.resolve(
      FindPostByVideoIdUseCase
    );
    try {
      const video = await findPostByVideoIdUseCase.execute(video_id);
      return res.status(200).json(video);
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
