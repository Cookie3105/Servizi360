// server/controllers/searchController.js

import { ricercaServiziService } from "../services/searchService.js";

export async function ricercaServizi(req, res) {
  try {
    const {
      luogo,
      servizio,
      prezzoMin,
      prezzoMax,
      valutMin,
      disponibilita,
      sortBy,
    } = req.body;

    if (!luogo || !servizio) {
      return res.status(400).json({
        success: false,
        message: "Luogo e servizio sono obbligatori",
      });
    }

    // Parsing numerico soft: se non c'è o non è numero -> undefined
    const parsedPrezzoMin = prezzoMin ? Number(prezzoMin) : undefined;
    const parsedPrezzoMax = prezzoMax ? Number(prezzoMax) : undefined;
    const parsedValutMin = valutMin ? Number(valutMin) : undefined;

    const risultati = await ricercaServiziService({
      luogo,
      servizio,
      prezzoMin: parsedPrezzoMin,
      prezzoMax: parsedPrezzoMax,
      valutMin: parsedValutMin,
      disponibilita: disponibilita || "",
      sortBy: sortBy || "",
    });

    return res.json(risultati);
  } catch (err) {
    console.error("❌ Errore ricerca servizi:", err);
    return res.status(500).json({
      success: false,
      message: "Errore durante la ricerca",
    });
  }
}
