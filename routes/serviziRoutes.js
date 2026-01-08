// server/routes/serviziRoutes.js
import express from "express";
import { 
  listaServizi, 
  getServizioById,
  creaServizio,
  aggiornaServizio,
  eliminaServizio 
} from "../controllers/serviziController.js";

import { verificaToken } from "../middleware/verificaToken.js";
import { verificaRuolo } from "../middleware/verificaRuolo.js";

const router = express.Router();

// GET /api/servizi
// Cerca e filtra i servizi (usa la logica del Controller)
router.get("/", listaServizi);

// GET /api/servizi/:id
// Dettaglio singolo servizio
router.get("/:id", getServizioById);

// --- Rotte protette per Admin (Opzionali ma consigliate) ---

// POST /api/servizi (Crea nuovo servizio)
router.post("/", verificaToken, verificaRuolo("admin"), creaServizio);

// PUT /api/servizi/:id (Modifica servizio)
router.put("/:id", verificaToken, verificaRuolo("admin"), aggiornaServizio);

// DELETE /api/servizi/:id (Elimina servizio)
router.delete("/:id", verificaToken, verificaRuolo("admin"), eliminaServizio);

export default router;