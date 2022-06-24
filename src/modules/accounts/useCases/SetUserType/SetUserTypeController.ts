import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SetUserTypeUseCase } from './SetUserTypeUseCase';

export class SetUserTypeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user_id, type } = req.body;
    const setUserTypeUseCase = container.resolve(SetUserTypeUseCase);
    try {
      await setUserTypeUseCase.execute({ user_id, type });
      return res
        .status(200)
        .json({ message: 'User type was changed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: 'error' });
    }
  }
}
