// server/routes/serviziPopolaRoutes.js
// Popolamento iniziale servizi nel database

import express from "express";
import { popolaServizi } from "../controllers/serviziController.js";
import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

/**
 * POPOLA IL DATABASE DI SERVIZI
 * (solo admin)
 */
router.post("/", verificaToken, verificaRuolo("admin"), popolaServizi);

export default router;
