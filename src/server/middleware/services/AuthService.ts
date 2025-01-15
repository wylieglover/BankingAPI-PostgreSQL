import { CustomJwtPayload } from "../../types/jwt-types";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private secret: string;
  private refreshSecret: string;

  constructor(secret: string, refreshSecret: string) {
    if (!secret || !refreshSecret) {
      throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not defined");
    }
    this.secret = secret;
    this.refreshSecret = refreshSecret;
  }

  decodeToken(token: string): CustomJwtPayload {
    return jwt.decode(token) as CustomJwtPayload;
  }

  signToken(
    payload: { customer_id: string; [key: string]: any },
    expiresIn = "15m",
  ): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verifyToken(token: string): CustomJwtPayload {
    try {
      return jwt.verify(token, this.secret) as CustomJwtPayload;
    } catch (error) {
      throw new Error("Token is invalid or expired");
    }
  }

  signRefreshToken(payload: { customer_id: string }, expiresIn = "7d"): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn });
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.refreshSecret);
  }
}

export const authService = new AuthService(
  process.env.JWT_SECRET || "",
  process.env.JWT_REFRESH_SECRET || "",
);
