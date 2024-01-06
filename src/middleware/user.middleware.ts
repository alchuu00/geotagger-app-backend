import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const prismaService = new PrismaService();
  const token = req.cookies['access_token'];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'object') {
      const user = await prismaService.user.findUnique({
        where: { id: decoded.sub },
      });

      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    console.error(err);
  }

  next();
}
