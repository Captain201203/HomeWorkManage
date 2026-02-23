// src/routers/auth/router.ts
import { Router } from "express";
import { authController } from "../../controllers/auth/controller.js";

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));

export const authRouter = router;