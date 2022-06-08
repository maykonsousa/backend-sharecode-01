import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { gh_username, name, email, password } = req.body;
    const creatUserUseCase = container.resolve(CreateUserUseCase);
    try {
      const user = await creatUserUseCase.execute({
        gh_username,
        name,
        email,
        password,
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
