// server/routes/promozioniRoutes.js
// Gestione promozioni globali

import express from "express";
import {
  creaPromozione,
  aggiornaPromozione,
  eliminaPromozione,
  listaPromozioni,
  promozioniAttive,
  getPromozioneById
} from "../controllers/promozioniController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// CREA PROMOZIONE (admin)
router.post("/", verificaToken, verificaRuolo("admin"), creaPromozione);

// LISTA TUTTE LE PROMOZIONI
router.get("/", listaPromozioni);

// LISTA PROMOZIONI ATTIVE
router.get("/attive", promozioniAttive);

// OTTIENI PROMOZIONE SINGOLA
router.get("/:id", getPromozioneById);

// AGGIORNA PROMOZIONE
router.put("/:id", verificaToken, verificaRuolo("admin"), aggiornaPromozione);

// ELIMINA PROMOZIONE
router.delete("/:id", verificaToken, verificaRuolo("admin"), eliminaPromozione);

export default router;
