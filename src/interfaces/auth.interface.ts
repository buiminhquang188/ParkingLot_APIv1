import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { JwtPayload } from 'jsonwebtoken';

export interface DataStoredInToken extends JwtPayload {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
