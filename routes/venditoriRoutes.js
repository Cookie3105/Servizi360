// server/routes/venditoriRoutes.js
// Gestione profilo venditore

import express from "express";
import {
  creaVenditore,
  getVenditoreLogged,
  aggiornaVenditore,
  venditoreById,
  listaVenditori
} from "../controllers/venditoriController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// CREA PROFILO VENDITORE
router.post("/", verificaToken, verificaRuolo("user"), creaVenditore);

// PROFILO DEL VENDITORE LOGGATO
router.get(
  "/me",
  verificaToken,
  verificaRuolo("venditore"),
  getVenditoreLogged
);

// LISTA TUTTI I VENDITORI
router.get("/", listaVenditori);

// OTTIENI VENDITORE PER ID
router.get("/:id", venditoreById);

// AGGIORNA PROFILO VENDITORE
router.put(
  "/:id",
  verificaToken,
  verificaRuolo("venditore"),
  aggiornaVenditore
);

export default router;
