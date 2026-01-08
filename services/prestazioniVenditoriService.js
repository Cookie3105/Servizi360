// server/services/prestazioniVenditoriService.js
// Logica per prestazioni specifiche del venditore

import PrestazioneVenditore from "../models/PrestazioneVenditore.js";
import Venditore from "../models/Venditore.js";
import Servizio from "../models/Servizio.js";

/**
 * Crea una prestazione per il venditore
 */
export const creaPrestazioneService = async (venditoreId, dati) => {
  const { servizioId, descrizione, immagini, prezzo, durata, tags } = dati;

  // Verifica servizio esistente
  const servizio = await Servizio.findById(servizioId);
  if (!servizio) throw new Error("Servizio non trovato.");

  // Crea prestazione
  const prestazione = await PrestazioneVenditore.create({
    venditore: venditoreId,
    servizio: servizioId,
    descrizione,
    immagini: immagini || [],
    prezzo,
    durata,
    tags: tags || [],
  });

  // Aggiorna venditore
  await Venditore.findByIdAndUpdate(venditoreId, {
    $push: { prestazioni: prestazione._id },
  });

  // Collega venditore al servizio se non già presente
  if (!servizio.venditori.includes(venditoreId)) {
    servizio.venditori.push(venditoreId);
    await servizio.save();
  }

  return prestazione;
};

/**
 * Recupera tutte le prestazioni del venditore
 */
export const listaPrestazioniVenditoreService = async (venditoreId) => {
  return await PrestazioneVenditore.find({ venditore: venditoreId }).populate("servizio");
};

/**
 * Recupera una singola prestazione
 */
export const getPrestazioneService = async (id) => {
  const prestazione = await PrestazioneVenditore.findById(id)
    .populate("venditore")
    .populate("servizio");

  if (!prestazione) throw new Error("Prestazione non trovata.");

  return prestazione;
};

/**
 * Aggiorna una prestazione
 */
export const aggiornaPrestazioneService = async (prestazioneId, dati) => {
  const prestazione = await PrestazioneVenditore.findByIdAndUpdate(
    prestazioneId,
    dati,
    { new: true }
  );

  if (!prestazione) throw new Error("Prestazione non trovata.");

  return prestazione;
};

/**
 * Elimina una prestazione del venditore
 */
export const eliminaPrestazioneService = async (prestazioneId) => {
  const prestazione = await PrestazioneVenditore.findById(prestazioneId);

  if (!prestazione) throw new Error("Prestazione non trovata.");

  // Rimuove dal venditore
  await Venditore.findByIdAndUpdate(prestazione.venditore, {
    $pull: { prestazioni: prestazione._id },
  });

  // Elimina prestazione
  await PrestazioneVenditore.findByIdAndDelete(prestazioneId);

  return true;
};
