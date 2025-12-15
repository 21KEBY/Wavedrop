import { Router } from "express";
import { authController } from "../controller/inscription.controller";
import { requireConnection } from "../middleware/connection.middleware";

const router = Router();

// INSCRIPTION
router.post("/register", authController.register);

// CONNEXION
router.post("/login", authController.login);

// GET USER INFO (protégé)
router.get("/me", requireConnection, authController.getCurrentUser);

export default router;
