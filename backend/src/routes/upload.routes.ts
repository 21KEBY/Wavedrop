import { Router } from "express";
import { uploadController } from "../controller/upload.controller.ts";
import { requireConnection } from "../middleware/connection.middleware.ts";
import { uploadMiddleware } from "../middleware/upload.middleware.ts";

const router = Router();

// POST /upload
router.post(
  "/",
  requireConnection,
  uploadMiddleware.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  uploadController.upload
);

export default router;
