import { Request, Response } from "express";
import { authService } from "../service/inscription.service"

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;

      const result = await authService.register(email, password, username);

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
