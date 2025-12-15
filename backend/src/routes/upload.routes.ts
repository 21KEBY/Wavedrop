import { Router } from "express";
import { uploadController } from "../controller/upload.controller";
import { requireConnection } from "../middleware/connection.middleware";
import { uploadMiddleware } from "../middleware/upload.middleware";

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
