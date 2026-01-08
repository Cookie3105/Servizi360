// server/services/traduzioneService.js
// Logica di business per la traduzione tramite DeepL

import { translateText } from "../config/deepl.js";

/**
 * Traduce un singolo testo
 */
export const traduciTestoService = async (testo, lingua) => {
  if (!testo || !lingua) {
    throw new Error("Testo e lingua sono obbligatori.");
  }

  const tradotto = await translateText(testo, lingua);
  return tradotto;
};

/**
 * Traduce più testi in sequenza
 */
export const traduciMultiploService = async (testi, lingua) => {
  if (!testi || !Array.isArray(testi) || testi.length === 0) {
    throw new Error("Lista testi non valida.");
  }

  if (!lingua) {
    throw new Error("La lingua è obbligatoria.");
  }

  const risultati = [];

  for (const testo of testi) {
    const tradotto = await translateText(testo, lingua);
    risultati.push({
      originale: testo,
      tradotto,
    });
  }

  return risultati;
};
