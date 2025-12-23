// server/routes/recensioniRoutes.js
// Recensioni utenti verso venditori e prestazioni

import express from "express";
import {
  creaRecensione,
  recensioniPrestazione,
  recensioniVenditore,
  eliminaRecensione
} from "../controllers/recensioniController.js";

import { verificaToken } from "../middleware/verificaToken.js";

const router = express.Router();

// CREA RECENSIONE
router.post("/", verificaToken, creaRecensione);

// RECENSIONI PER PRESTAZIONE
router.get("/prestazione/:id", recensioniPrestazione);

// RECENSIONI PER VENDITORE
router.get("/venditore/:id", recensioniVenditore);

// ELIMINA RECENSIONE (utente o admin)
router.delete("/:id", verificaToken, eliminaRecensione);

export default router;
