// server/routes/disponibilitaRoutes.js
// Gestione disponibilità settimanali dei venditori

import express from "express";
import {
  creaDisponibilita,
  listaDisponibilitaVenditore,
  eliminaDisponibilita,
  aggiornaDisponibilita
} from "../controllers/disponibilitaController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

/**
 * CREAZIONE disponibilità (solo venditore)
 * POST /api/disponibilita/
 */
router.post("/", verificaToken, verificaRuolo("venditore"), creaDisponibilita);

/**
 * LISTA disponibilità del proprio profilo venditore
 * GET /api/disponibilita/mie
 */
router.get(
  "/mie",
  verificaToken,
  verificaRuolo("venditore"),
  listaDisponibilitaVenditore
);

/**
 * AGGIORNAMENTO disponibilità
 * PUT /api/disponibilita/:id
 */
router.put(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  aggiornaDisponibilita
);

/**
 * ELIMINAZIONE disponibilità
 * DELETE /api/disponibilita/:id
 */
router.delete(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  eliminaDisponibilita
);

export default router;
