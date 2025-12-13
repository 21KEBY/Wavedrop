import { Router } from "express";
import { connectionController } from "../controller/connection.controller";

const router = Router();

// CONNEXION
router.post("/login", connectionController.login);

export default router;
