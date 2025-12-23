import express from "express";
import Servizio from "../models/Servizio.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { citta, servizio } = req.query;

    // Costruzione filtro dinamico
    const filtro = {};
    if (citta) filtro.citta = { $regex: new RegExp(citta, "i") };
    if (servizio) filtro.nome = { $regex: new RegExp(servizio, "i") };

    // Ottieni servizi dal DB
    const serviziDB = await Servizio.find();

    // Se il DB non ha servizi → usa MOCK filtrati
    if (!serviziDB.length) {
      console.log("⚠️ DB vuoto → uso mock");

      const mock = [
        {
          nome: "Elettricista Mario Rossi",
          descrizione: "Interventi rapidi 24/7 e impianti domotici.",
          immagine: "https://placehold.co/400x250/6366F1/FFFFFF?text=Elettricista",
          citta: "Roma",
          prezzoMedio: 60,
          recensioneMedia: 8.5
        },
        {
          nome: "Personal Trainer Eva",
          descrizione: "Allenamenti personalizzati in palestra o online.",
          immagine: "https://placehold.co/400x250/D946EF/FFFFFF?text=Trainer",
          citta: "Milano",
          prezzoMedio: 50,
          recensioneMedia: 9.0
        },
        {
          nome: "Chef a Domicilio",
          descrizione: "Cene gourmet per eventi privati.",
          immagine: "https://placehold.co/400x250/F59E0B/FFFFFF?text=Chef",
          citta: "Roma",
          prezzoMedio: 80,
          recensioneMedia: 8.7
        }
      ];

      // Applicazione filtri ANCHE AI MOCK
      const filtrati = mock.filter(s => {
        const matchCitta = citta
          ? s.citta?.toLowerCase().includes(citta.toLowerCase())
          : true;

        const matchServizio = servizio
          ? s.nome?.toLowerCase().includes(servizio.toLowerCase())
          : true;

        return matchCitta && matchServizio;
      });

      return res.json(filtrati);
    }

    // ALTRIMENTI — filtra servizi reali dal DB
    const risultati = await Servizio.find(filtro);

    return res.json(risultati);

  } catch (err) {
    console.error("Errore ricerca servizi:", err);
    res.status(500).json({ message: "Errore nel recupero dei servizi." });
  }
});

export default router;