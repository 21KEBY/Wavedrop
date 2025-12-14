import { Router } from "express";
import { tracksController } from "../controller/tracks.controller.ts";
import { requireConnection } from "../middleware/connection.middleware.ts";

const router = Router();

// 🔓 Route publique (pas besoin de token)
// GET /tracks/public
router.get("/public", tracksController.publicHome);

// 🔐 Route protégée (token obligatoire)
// GET /tracks/connected
router.get("/connected", requireConnection, tracksController.connectedHome);

export default router;
