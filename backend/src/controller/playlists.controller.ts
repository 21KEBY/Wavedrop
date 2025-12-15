import type { Response } from "express";
import { playlistsService } from "../service/playlists.service";
import type { ConnectionRequest } from "../middleware/connection.middleware";

export const playlistsController = {

  // Créer une playlist
  async create(req: ConnectionRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { name } = req.body;

      const playlist = await playlistsService.create(userId, name);
      res.status(201).json(playlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Supprimer une playlist
  async delete(req: ConnectionRequest, res: Response) {
    const userId = req.user!.id;
    const playlistId = Number(req.params.id);

    await playlistsService.delete(userId, playlistId);
    res.status(204).send();
  },

  // Renommer une playlist
  async update(req: ConnectionRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const playlistId = Number(req.params.id);
      const { name } = req.body;

      const playlist = await playlistsService.update(userId, playlistId, name);
      res.status(200).json(playlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  // Voir ses playlists
  async getAll(req: ConnectionRequest, res: Response) {
    const playlists = await playlistsService.getAll(req.user!.id);
    res.status(200).json(playlists);
  },

  // Ajouter une musique
  async addTrack(req: ConnectionRequest, res: Response) {
    try {
      const playlistId = Number(req.params.id);
      const { trackId } = req.body;

      await playlistsService.addTrack(playlistId, trackId);
      res.status(200).json({ message: "Musique ajoutée à la playlist" });
    } catch (error: any) {
      if (error.message === "Cette musique est déjà dans la playlist") {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  // Retirer une musique
  async removeTrack(req: ConnectionRequest, res: Response) {
    const playlistId = Number(req.params.id);
    const trackId = Number(req.params.trackId);

    await playlistsService.removeTrack(playlistId, trackId);
    res.status(200).json({ message: "Musique retirée de la playlist" });
  },
};
