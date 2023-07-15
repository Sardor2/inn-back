import { Role } from '../auth.constants';

export type JwtPayload = {
  sub: string;
  role: string;
};
