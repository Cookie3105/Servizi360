// server/services/prenotazioniService.js

import Prenotazione from "../models/Prenotazione.js";
import Disponibilita from "../models/Disponibilita.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";
import Venditore from "../models/Venditore.js";

/**
 * Verifica disponibilità per data e ora
 */
export const verificaDisponibilitaService = async (prestazioneId, data, ora) => {
  const prestazione = await PrestazioneVenditore.findById(prestazioneId)
    .populate("venditore");

  if (!prestazione) throw new Error("Prestazione non trovata.");

  const venditore = prestazione.venditore;
  const giornoSettimana = new Date(data).getDay();

  const disponibilita = await Disponibilita.findOne({
    venditore: venditore._id,
    giornoSettimana,
    attivo: true,
  });

  if (!disponibilita) {
    throw new Error("Il venditore non è disponibile in questo giorno.");
  }

  // Controllo slot già occupati
  const slotOccupato = disponibilita.slotOccupati.find(
    (slot) =>
      slot.data.toISOString() === new Date(data).toISOString() &&
      slot.ora === ora
  );

  if (slotOccupato) {
    throw new Error("L'orario selezionato non è più disponibile.");
  }

  return { prestazione, venditore, disponibilita };
};

/**
 * Crea prenotazione
 */
export const creaPrenotazioneService = async ({
  utenteId,
  prestazioneId,
  data,
  ora,
  note,
}) => {
  const { prestazione, venditore, disponibilita } =
    await verificaDisponibilitaService(prestazioneId, data, ora);

  const prenotazione = await Prenotazione.create({
    utente: utenteId,
    venditore: venditore._id,
    prestazione: prestazioneId,
    data,
    ora,
    prezzoTotale: prestazione.prezzo,
    note,
  });

  disponibilita.slotOccupati.push({
    data,
    ora,
    prenotazione: prenotazione._id,
  });

  await disponibilita.save();

  return { prenotazione, venditore };
};

/**
 * Lista prenotazioni utente
 */
export const prenotazioniUtenteService = async (utenteId) => {
  return await Prenotazione.find({ utente: utenteId })
    .populate("venditore")
    .populate("prestazione");
};

/**
 * Lista prenotazioni venditore
 */
export const prenotazioniVenditoreService = async (utenteId) => {
  const venditore = await Venditore.findOne({ utente: utenteId });

  if (!venditore) {
    throw new Error("Venditore non trovato.");
  }

  return await Prenotazione.find({ venditore: venditore._id })
    .populate("utente")
    .populate("prestazione");
};

/**
 * Aggiorna stato prenotazione
 */
export const aggiornaStatoPrenotazioneService = async (id, stato) => {
  const prenotazione = await Prenotazione.findByIdAndUpdate(
    id,
    { stato },
    { new: true }
  );

  if (!prenotazione) {
    throw new Error("Prenotazione non trovata.");
  }

  return prenotazione;
};

/**
 * 🔥 Ottiene prenotazione tramite ID (manca nel tuo file originale)
 */
export const getPrenotazioneByIdService = async (id) => {
  const pren = await Prenotazione.findById(id)
    .populate("utente")
    .populate("venditore")
    .populate("prestazione");

  if (!pren) {
    throw new Error("Prenotazione non trovata.");
  }

  return pren;
};
