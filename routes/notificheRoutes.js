// server/routes/notificheRoutes.js
import express from "express";
import {
  getNotificheUtente,
  creaNotifica,
  inviaEmailNotifica,
  eliminaNotifica
} from "../controllers/notificheController.js";

import { verificaToken } from "../middleware/verificaToken.js";

const router = express.Router();

// Tutte le rotte notifiche richiedono il login
router.use(verificaToken);

// GET /api/notifiche -> Leggi notifiche utente
router.get("/", getNotificheUtente);

// POST /api/notifiche -> Crea notifica (interna + push opzionale)
router.post("/", creaNotifica);

// POST /api/notifiche/email -> Invia email
router.post("/email", inviaEmailNotifica);

// DELETE /api/notifiche/:id -> Elimina notifica
router.delete("/:id", eliminaNotifica);

export default router;