// server/routes/prenotazioniRoutes.js
// Gestione prenotazioni utenti e venditori

import express from "express";

import {
  creaPrenotazione,
  listaPrenotazioniUtente,
  listaPrenotazioniVenditore,
  aggiornaStatoPrenotazione,
  getPrenotazioneById
} from "../controllers/prenotazioniController.js";

import {
  creaPagamento,
  confermaPagamento
} from "../controllers/paymentController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

/**
 * CREA UNA PRENOTAZIONE
 * POST /api/prenotazioni/
 * (utente)
 */
router.post("/", verificaToken, verificaRuolo("user"), creaPrenotazione);

/**
 * PRENOTAZIONI DELL'UTENTE
 * GET /api/prenotazioni/mie
 */
router.get(
  "/mie",
  verificaToken,
  verificaRuolo("user"),
  listaPrenotazioniUtente
);

/**
 * PRENOTAZIONI DEL VENDITORE LOGGATO
 * GET /api/prenotazioni/venditore
 */
router.get(
  "/venditore",
  verificaToken,
  verificaRuolo("venditore"),
  listaPrenotazioniVenditore
);

/**
 * SINGOLA PRENOTAZIONE
 * GET /api/prenotazioni/:id
 */
router.get("/:id", verificaToken, getPrenotazioneById);

/**
 * AGGIORNAMENTO STATO PRENOTAZIONE
 * PUT /api/prenotazioni/:id
 * (solo venditore)
 */
router.put(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  aggiornaStatoPrenotazione
);

/* -------------------------
      SEZIONE PAGAMENTI
-------------------------- */

/**
 * CREAZIONE PAYMENT INTENT STRIPE
 * POST /api/prenotazioni/pagamento/create
 */
router.post(
  "/pagamento/create",
  verificaToken,
  verificaRuolo("user"),
  creaPagamento
);

/**
 * CONFERMA PAGAMENTO STRIPE
 * POST /api/prenotazioni/pagamento/confirm
 */
router.post(
  "/pagamento/confirm",
  verificaToken,
  verificaRuolo("user"),
  confermaPagamento
);

export default router;
