import { Router } from "express";
import { streamingController } from "../controller/streaming.controller";

const router = Router();

// GET /tracks/:id/sas
router.get("/:id/sas", streamingController.getSas);

export default router;
