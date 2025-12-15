import { Router } from "express";
import { downloadController } from "../controller/download.controller";

const router = Router();

// GET /download/:id
router.get("/:id", downloadController.downloadTrack);

export default router;
