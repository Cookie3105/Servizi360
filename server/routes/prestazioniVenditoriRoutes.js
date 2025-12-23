// server/routes/prestazioniVenditoriRoutes.js
// Gestione prestazioni offerte dai venditori

import express from "express";

import {
  creaPrestazione,
  aggiornaPrestazione,
  eliminaPrestazione,
  listaPrestazioniVenditore,
  getPrestazioneById
} from "../controllers/prestazioniVenditoriController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

/**
 * CREA UNA PRESTAZIONE PER IL VENDITORE LOGGATO
 * POST /api/prestazioni-venditori/
 */
router.post(
  "/",
  verificaToken,
  verificaRuolo("venditore"),
  creaPrestazione
);

/**
 * OTTIENI TUTTE LE PRESTAZIONI DEL VENDITORE LOGGATO
 * GET /api/prestazioni-venditori/mie
 */
router.get(
  "/mie",
  verificaToken,
  verificaRuolo("venditore"),
  listaPrestazioniVenditore
);

/**
 * SINGOLA PRESTAZIONE (pubblico)
 * GET /api/prestazioni-venditori/:id
 */
router.get("/:id", getPrestazioneById);

/**
 * AGGIORNA PRESTAZIONE
 * PUT /api/prestazioni-venditori/:id
 */
router.put(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  aggiornaPrestazione
);

/**
 * ELIMINA PRESTAZIONE
 * DELETE /api/prestazioni-venditori/:id
 */
router.delete(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  eliminaPrestazione
);

export default router;
