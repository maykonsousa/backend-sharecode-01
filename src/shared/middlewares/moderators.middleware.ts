import { NextFunction, Request, Response } from 'express';
import { PrismaUsersRepository } from 'modules/accounts/repositories/implementations/PrismaUsersRepository';

export const EnsuresModerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  const repository = new PrismaUsersRepository();
  if (!id) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await repository.findById(id);

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (user.type === 'user') {
    return res.status(401).json({ error: 'unauthorized' });
  }
  return next();
};
