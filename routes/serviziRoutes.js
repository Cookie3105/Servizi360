import express from "express";
import { 
  listaServizi, 
  getServizioById,
  creaServizio,
  aggiornaServizio,
  eliminaServizio,
  cercaServizi // <--- IMPORTANTE: Deve essere importato
} from "../controllers/serviziController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// GET /api/servizi
router.get("/", listaServizi);

// GET /api/servizi/:id
router.get("/:id", getServizioById);

// --- ROTTA RICERCA (PUBBLICA) ---
// Se questa riga manca, il bottone darà errore 404
router.post("/cerca", cercaServizi); 

// --- ROTTE PROTETTE VENDITORE ---
router.post("/", verificaToken, verificaRuolo("venditore"), creaServizio);
router.put("/:id", verificaToken, verificaRuolo("venditore"), aggiornaServizio);
router.delete("/:id", verificaToken, verificaRuolo("venditore"), eliminaServizio);

export default router;