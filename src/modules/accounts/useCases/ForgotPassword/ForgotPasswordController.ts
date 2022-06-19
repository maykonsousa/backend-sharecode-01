import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

export class ForgotPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);
    try {
      const token = await forgotPasswordUseCase.execute(email);
      return res
        .status(200)
        .json({ message: 'recovery e-email is send', token });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'unexpected error' });
    }
  }
}
