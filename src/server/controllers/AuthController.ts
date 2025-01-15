import { Request, Response } from "express";
import { authService } from "../middleware/services/AuthService";
import { Logger } from "../middleware/utils/Logger";

export class AuthController {
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token is required" });
        return;
      }

      const decoded = authService.verifyRefreshToken(refreshToken);

      const newAccessToken = authService.signToken({
        customer_id: decoded.customer_id,
      });

      res.status(200).json({
        token: newAccessToken,
      });
    } catch (error: any) {
      Logger.error("Error refreshing token:", error.message);
      res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  }
}
