import type { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const downloadController = {
  
  async downloadTrack(req: Request, res: Response) {
    try {
      const trackId = parseInt(req.params.id);
      
      const track = await prisma.track.findUnique({
        where: { id: trackId }
      });
      
      if (!track) {
        return res.status(404).json({ error: "Musique introuvable" });
      }
      
      // Rediriger vers le blob Azure
      return res.redirect(track.audioUrl);
      
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
};
