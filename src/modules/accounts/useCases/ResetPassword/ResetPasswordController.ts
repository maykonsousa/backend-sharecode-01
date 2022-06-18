import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';

export class ResetPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { token } = req.params;
    const { password } = req.body;
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);
    try {
      await resetPasswordUseCase.execute(token, password);
      return res.status(200).json({ message: 'password reseted' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Unexpected error' });
    }
  }
}
