import { Router } from "express";
import { streamingController } from "../controller/streaming.controller.ts";

const router = Router();

// GET /tracks/:id/sas
router.get("/:id/sas", streamingController.getSas);

export default router;
