import { Request } from 'express';
import { UserType } from 'src/utils/types';

export interface TokenPayload {
  name: string;
  sub: string;
  type: JwtType;
}

export interface RequestWithUser extends Request {
  user: UserType;
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}
