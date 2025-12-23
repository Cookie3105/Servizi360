// server/services/promozioniService.js
// Logica per promozioni globali della piattaforma

import Promozione from "../models/Promozione.js";

/**
 * Crea una promozione globale
 */
export const creaPromozioneService = async (dati) => {
  const promozione = await Promozione.create({
    titolo: dati.titolo,
    descrizione: dati.descrizione || "",
    immagine: dati.immagine || "",
    percentualeSconto: dati.percentualeSconto || null,
    dataInizio: dati.dataInizio,
    dataFine: dati.dataFine,
    tags: dati.tags || [],
    attiva: true,
  });

  return promozione;
};

/**
 * Lista completa delle promozioni
 */
export const listaPromozioniService = async () => {
  return await Promozione.find().sort({ dataInizio: -1 });
};

/**
 * Lista promozioni attualmente valide
 */
export const promozioniAttiveService = async () => {
  const now = new Date();

  return await Promozione.find({
    attiva: true,
    dataInizio: { $lte: now },
    dataFine: { $gte: now },
  }).sort({ dataInizio: -1 });
};

/**
 * Recupera una promozione tramite ID
 */
export const getPromozioneByIdService = async (id) => {
  const promozione = await Promozione.findById(id);

  if (!promozione) throw new Error("Promozione non trovata.");

  return promozione;
};

/**
 * Aggiorna una promozione globale
 */
export const aggiornaPromozioneService = async (id, dati) => {
  const promozione = await Promozione.findByIdAndUpdate(id, dati, {
    new: true,
  });

  if (!promozione) throw new Error("Promozione non trovata.");

  return promozione;
};

/**
 * Elimina una promozione
 */
export const eliminaPromozioneService = async (id) => {
  const promozione = await Promozione.findById(id);

  if (!promozione) throw new Error("Promozione non trovata.");

  await Promozione.findByIdAndDelete(id);

  return true;
};
