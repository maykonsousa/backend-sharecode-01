import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaUsersRepository } from 'modules/accounts/repositories/implementations/PrismaUsersRepository';

interface IPayload {
  sub: string;
}

export const EnsureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as IPayload;
    const usersRepository = new PrismaUsersRepository();
    const user = usersRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: userId };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
