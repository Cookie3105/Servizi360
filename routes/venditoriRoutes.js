// server/routes/venditoriRoutes.js
import express from "express";
import {
  registerVenditore, // <--- NUOVA
  loginVenditore,    // <--- NUOVA
  listaVenditori,
  venditoreById,
  creaVenditore,
  getVenditoreLogged,
  aggiornaVenditore
} from "../controllers/venditoriController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// --- ROTTE PUBBLICHE (Auth) ---
router.post("/register", registerVenditore); // Risolve l'errore 404
router.post("/login", loginVenditore);

// --- ROTTE DI LETTURA ---
router.get("/", listaVenditori);
router.get("/:id", venditoreById);

// --- ROTTE PROTETTE ---
// (Queste richiedono token, le sistemeremo dopo se servono)
router.post("/", verificaToken, verificaRuolo("user"), creaVenditore);
router.get("/me", verificaToken, verificaRuolo("venditore"), getVenditoreLogged);
router.put("/:id", verificaToken, verificaRuolo("venditore"), aggiornaVenditore);

export default router;