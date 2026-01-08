// server/services/offerteService.js
// Logica completa per gestione offerte dei venditori

import Offerta from "../models/Offerta.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";

/**
 * Crea una nuova offerta per un venditore
 */
export const creaOffertaService = async (venditoreId, dati) => {
  const offerta = await Offerta.create({
    venditore: venditoreId,
    prestazione: dati.prestazioneId || null,
    titolo: dati.titolo,
    descrizione: dati.descrizione || "",
    percentualeSconto: dati.percentualeSconto || null,
    prezzoScontato: dati.prezzoScontato || null,
    dataInizio: dati.dataInizio,
    dataFine: dati.dataFine,
    tags: dati.tags || [],
    attiva: true,
  });

  return offerta;
};

/**
 * Recupera tutte le offerte di un venditore
 */
export const offerteVenditoreService = async (venditoreId) => {
  return await Offerta.find({ venditore: venditoreId }).populate("prestazione");
};

/**
 * Recupera tutte le offerte attive globali
 */
export const offerteAttiveService = async () => {
  const now = new Date();

  return await Offerta.find({
    attiva: true,
    dataInizio: { $lte: now },
    dataFine: { $gte: now },
  })
    .populate("prestazione")
    .populate("venditore");
};

/**
 * Recupera una singola offerta tramite ID
 */
export const getOffertaByIdService = async (offertaId) => {
  const offerta = await Offerta.findById(offertaId)
    .populate("prestazione")
    .populate("venditore");

  if (!offerta) throw new Error("Offerta non trovata.");

  return offerta;
};

/**
 * Aggiorna un’offerta
 */
export const aggiornaOffertaService = async (offertaId, dati) => {
  const offerta = await Offerta.findByIdAndUpdate(offertaId, dati, {
    new: true,
  });

  if (!offerta) throw new Error("Offerta non trovata.");

  return offerta;
};

/**
 * Elimina un’offerta
 */
export const eliminaOffertaService = async (offertaId) => {
  const offerta = await Offerta.findById(offertaId);

  if (!offerta) throw new Error("Offerta non trovata.");

  await Offerta.findByIdAndDelete(offertaId);

  return true;
};

/**
 * Calcola il prezzo finale applicando un’offerta (se presente)
 */
export const calcolaPrezzoConOfferta = async (prestazioneId, prezzoBase) => {
  const now = new Date();

  // Cerca un'offerta attiva sulla prestazione
  const offerta = await Offerta.findOne({
    prestazione: prestazioneId,
    attiva: true,
    dataInizio: { $lte: now },
    dataFine: { $gte: now },
  });

  if (!offerta) return prezzoBase;

  // Se ha prezzo fisso scontato → usa quello
  if (offerta.prezzoScontato) return offerta.prezzoScontato;

  // Se ha percentuale di sconto → calcola
  if (offerta.percentualeSconto) {
    return prezzoBase - (prezzoBase * offerta.percentualeSconto) / 100;
  }

  return prezzoBase;
};
