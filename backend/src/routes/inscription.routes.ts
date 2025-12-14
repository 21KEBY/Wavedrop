import { Router } from "express";
import { authController } from "../controller/inscription.controller.ts";

const router = Router();

// INSCRIPTION
router.post("/register", authController.register);

// CONNEXION
router.post("/login", authController.login);

export default router;
