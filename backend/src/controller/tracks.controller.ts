import type { Request, Response } from "express";
import { tracksService } from "../service/tracks.service";
import type { ConnectionRequest } from "../middleware/connection.middleware";

export const tracksController = {

  // 🔓 ACCUEIL PUBLIC
  // Accessible sans token
  async publicHome(req: Request, res: Response) {
    const tracks = await tracksService.getPublicHome();
    return res.status(200).json(tracks);
  },

  // 🔐 ACCUEIL CONNECTÉ
  // Accessible uniquement avec un token valide
  async connectedHome(req: ConnectionRequest, res: Response) {
    const userId = req.user!.id; // récupéré depuis le middleware
    const tracks = await tracksService.getConnectedHome(userId);
    return res.status(200).json(tracks);
  },
};
