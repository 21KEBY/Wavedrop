import type { Request, Response } from "express";
import { streamingService } from "../service/streaming.service.ts";

export const streamingController = {

  // 🔓 Streaming accessible à tous (public)
  async getSas(req: Request, res: Response) {
    try {
      const trackId = Number(req.params.id);
      const sasUrl = await streamingService.getStreamingUrl(trackId);
      res.status(200).json({ url: sasUrl });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
};
