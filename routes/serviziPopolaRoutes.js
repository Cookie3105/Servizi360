import express from "express";
import Servizio from "../models/Servizio.js"; // Assicurati che questo modello esista

const router = express.Router();

// Rotta GET per popolare i servizi (facile da lanciare dal browser)
router.get("/servizi", async (req, res) => {
  try {
    const serviziBase = [
      { nome: "Idraulico", categoria: "Casa", descrizione: "Riparazioni tubature e bagni" },
      { nome: "Elettricista", categoria: "Casa", descrizione: "Impianti elettrici e riparazioni" },
      { nome: "Fotografo", categoria: "Eventi", descrizione: "Shooting per eventi e cerimonie" },
      { nome: "Pulizie", categoria: "Casa", descrizione: "Pulizie domestiche e uffici" },
      { nome: "Giardiniere", categoria: "Esterni", descrizione: "Cura del verde e potature" },
      { nome: "Personal Trainer", categoria: "Salute", descrizione: "Allenamenti personalizzati" }
    ];

    // Cancella vecchi dati per evitare duplicati e reinserisce
    await Servizio.deleteMany({});
    await Servizio.insertMany(serviziBase);

    res.json({ success: true, message: "✅ Servizi importati con successo!", total: serviziBase.length });
  } catch (error) {
    console.error("Errore popolamento:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rotta Placeholder per i comuni (se non hai il file CSV pronto)
router.get("/comuni", (req, res) => {
  res.json({ success: true, message: "Per i comuni, registra un venditore con la sua città!" });
});

export default router;