import type { Request, Response } from "express";
import { connectionService } from "../service/connection.service";

export const connectionController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Email et mot de passe obligatoires",
        });
      }

      const result = await connectionService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        error: error.message,
      });
    }
  },
};
