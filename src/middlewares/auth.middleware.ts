import { UserEntity } from '@/entities/Users.entity';
import { SECRET_KEY } from '@config';
import { dbConnection } from '@databases';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userRepository = dbConnection.getRepository(UserEntity);
      const findUser = await userRepository.findOne({ where: { id }, select: ['id', 'email', 'password'] });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
