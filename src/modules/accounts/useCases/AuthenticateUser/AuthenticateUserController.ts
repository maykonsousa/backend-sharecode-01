import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

export class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    try {
      const response = await authenticateUserUseCase.execute({
        email,
        password,
      });
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
