import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  customer_id: string;
  [key: string]: any;
}
