import type { Request, Response } from "express";
import { authService } from "../service/inscription.service"
import type { ConnectionRequest } from "../middleware/connection.middleware";

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

  async getCurrentUser(req: ConnectionRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await authService.getUserById(userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
};
