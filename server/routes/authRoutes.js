// server/routes/authRoutes.js
// Route di autenticazione (registrazione, login, profilo utente)

import express from "express";
import {
  registraUtente,
  loginUtente,
  profiloUtente,
} from "../controllers/authController.js";
import { verificaToken } from "../middleware/verificaToken.js";

const router = express.Router();

// Registrazione nuovo utente
router.post("/register", registraUtente);

// Login utente
router.post("/login", loginUtente);

// Profilo utente loggato
router.get("/me", verificaToken, profiloUtente);

export default router;
