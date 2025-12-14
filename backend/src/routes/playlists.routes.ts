import { Router } from "express";
import { playlistsController } from "../controller/playlists.controller.ts";
import { requireConnection } from "../middleware/connection.middleware.ts";

const router = Router();

// 🔐 Toutes les routes playlists sont protégées
router.use(requireConnection);

// Créer une playlist
router.post("/", playlistsController.create);

// Voir ses playlists
router.get("/", playlistsController.getAll);

// Supprimer une playlist
router.delete("/:id", playlistsController.delete);

// Ajouter une musique
router.post("/:id/tracks", playlistsController.addTrack);

// Retirer une musique
router.delete("/:id/tracks/:trackId", playlistsController.removeTrack);

export default router;
