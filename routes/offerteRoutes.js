// server/routes/offerteRoutes.js
// Gestione delle offerte create dai venditori

import express from "express";

import {
  creaOfferta,
  aggiornaOfferta,
  eliminaOfferta,
  offerteVenditore,
  offerteAttive,
  getOffertaById
} from "../controllers/offerteController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

/**
 * CREAZIONE OFFERTA (solo venditore)
 * POST /api/offerte/
 */
router.post("/", verificaToken, verificaRuolo("venditore"), creaOfferta);

/**
 * OTTIENI TUTTE LE OFFERTE DEL PROPRIO PROFILO
 * GET /api/offerte/mie
 */
router.get(
  "/mie",
  verificaToken,
  verificaRuolo("venditore"),
  offerteVenditore
);

/**
 * OTTIENI TUTTE LE OFFERTE ATTIVE (pubblico)
 * GET /api/offerte/attive
 */
router.get("/attive", offerteAttive);

/**
 * OTTIENI UNA OFFERTA SPECIFICA
 * GET /api/offerte/:id
 */
router.get("/:id", getOffertaById);

/**
 * AGGIORNA UN’OFFERTA
 * PUT /api/offerte/:id
 */
router.put(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  aggiornaOfferta
);

/**
 * ELIMINA UN’OFFERTA
 * DELETE /api/offerte/:id
 */
router.delete(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  eliminaOfferta
);

export default router;
