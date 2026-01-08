// server/controllers/traduzioneController.js
// Controller per traduzioni automatiche tramite DeepL

import { translateText } from "../config/deepl.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * @route POST /api/traduci
 * @desc Traduce un testo singolo
 */
export const traduciTesto = async (req, res) => {
  try {
    const { testo, lingua } = req.body;

    if (!testo || !lingua) {
      return errorResponse(res, 400, "Testo e lingua sono obbligatori.");
    }

    const tradotto = await translateText(testo, lingua);

    return successResponse(res, {
      testoOriginale: testo,
      lingua,
      tradotto,
    });
  } catch (err) {
    console.error("❌ Errore traduciTesto:", err);
    return errorResponse(res, 500, "Errore durante la traduzione.");
  }
};

/**
 * @route POST /api/traduci/multiplo
 * @desc Traduce un array di testi (veloce e ottimizzato)
 */
export const traduciMultiplo = async (req, res) => {
  try {
    const { testi, lingua } = req.body;

    if (!testi || !Array.isArray(testi) || testi.length === 0) {
      return errorResponse(res, 400, "Lista di testi non valida.");
    }

    if (!lingua) {
      return errorResponse(res, 400, "La lingua è obbligatoria.");
    }

    const risultati = [];

    // Traduzione sequenziale (DeepL gestisce meglio richieste singole)
    for (const testo of testi) {
      const tradotto = await translateText(testo, lingua);
      risultati.push({
        originale: testo,
        tradotto,
      });
    }

    return successResponse(res, {
      lingua,
      risultati,
    });
  } catch (err) {
    console.error("❌ Errore traduciMultiplo:", err);
    return errorResponse(res, 500, "Errore durante la traduzione multipla.");
  }
};
