// server/routes/utentiRoutes.js
// Route ufficiali per gestione utenti

import express from "express";
import {
  getUtenteById,
  aggiornaUtente,
  aggiornaPreferenze,
  eliminaUtente,
  listaUtenti
} from "../controllers/utentiController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// LISTA UTENTI → solo admin
router.get("/", verificaToken, verificaRuolo("admin"), listaUtenti);

// OTTIENI UN UTENTE
router.get("/:id", verificaToken, getUtenteById);

// AGGIORNA DATI UTENTE
router.put("/:id", verificaToken, aggiornaUtente);

// AGGIORNA PREFERENZE
router.put("/:id/preferenze", verificaToken, aggiornaPreferenze);

// ELIMINA UTENTE (admin oppure se stesso)
router.delete("/:id", verificaToken, eliminaUtente);

export default router;
