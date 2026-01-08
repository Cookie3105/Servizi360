// server/routes/traduzioneRoutes.js
import express from "express";
import { 
  traduciTesto, 
  traduciMultiplo 
} from "../controllers/traduzioneController.js";

const router = express.Router();

// POST /api/traduci
// Traduce un testo singolo (es. { "testo": "Ciao", "lingua": "EN" })
router.post("/", traduciTesto);

// POST /api/traduci/multiplo
// Traduce un array di testi (es. { "testi": ["Ciao", "Mondo"], "lingua": "EN" })
router.post("/multiplo", traduciMultiplo);

export default router;