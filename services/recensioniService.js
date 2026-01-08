// server/services/recensioniService.js
// Logica completa per gestione recensioni utenti → venditori

import Recensione from "../models/Recensione.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";
import Venditore from "../models/Venditore.js";
import Prenotazione from "../models/Prenotazione.js";

/**
 * Verifica se l’utente può lasciare una recensione
 */
export const verificaPossibilitaRecensione = async (utenteId, prestazioneId) => {
  const prenotazione = await Prenotazione.findOne({
    utente: utenteId,
    prestazione: prestazioneId,
    stato: "completata",
  });

  if (!prenotazione) {
    throw new Error("Puoi recensire solo dopo aver completato il servizio.");
  }

  return true;
};

/**
 * Crea recensione e aggiorna statistiche venditore + prestazione
 */
export const creaRecensioneService = async ({
  utenteId,
  prestazioneId,
  voto,
  commento,
}) => {
  // Trova prestazione e venditore
  const prestazione = await PrestazioneVenditore.findById(prestazioneId).populate("venditore");

  if (!prestazione) {
    throw new Error("Prestazione non trovata.");
  }

  const venditore = prestazione.venditore;

  // Crea la recensione
  const recensione = await Recensione.create({
    utente: utenteId,
    venditore: venditore._id,
    prestazione: prestazioneId,
    voto,
    commento,
    dataRecensione: new Date(),
  });

  // Aggiorna media prestazione
  const recPrestazione = await Recensione.find({ prestazione: prestazioneId });

  const mediaPrestazione =
    recPrestazione.reduce((acc, r) => acc + r.voto, 0) / recPrestazione.length;

  prestazione.recensioneMedia = mediaPrestazione;
  prestazione.totaleRecensioni = recPrestazione.length;
  await prestazione.save();

  // Aggiorna media venditore
  const recVenditore = await Recensione.find({ venditore: venditore._id });

  const mediaVenditore =
    recVenditore.reduce((acc, r) => acc + r.voto, 0) / recVenditore.length;

  venditore.recensioneMedia = mediaVenditore;
  venditore.totaleRecensioni = recVenditore.length;
  await venditore.save();

  return recensione;
};

/**
 * Recupera recensioni di una prestazione specifica
 */
export const recensioniPrestazioneService = async (prestazioneId) => {
  return await Recensione.find({ prestazione: prestazioneId })
    .populate("utente", "nome email")
    .sort({ dataRecensione: -1 });
};

/**
 * Recupera recensioni di un venditore specifico
 */
export const recensioniVenditoreService = async (venditoreId) => {
  return await Recensione.find({ venditore: venditoreId })
    .populate("utente", "nome email")
    .populate("prestazione", "descrizione prezzo")
    .sort({ dataRecensione: -1 });
};

/**
 * Elimina una recensione e aggiorna statistiche collegate
 */
export const eliminaRecensioneService = async (utenteId, recensioneId, ruolo) => {
  const recensione = await Recensione.findById(recensioneId);

  if (!recensione) {
    throw new Error("Recensione non trovata.");
  }

  // autorizzazione (autore o admin)
  if (recensione.utente.toString() !== utenteId && ruolo !== "admin") {
    throw new Error("Non sei autorizzato a eliminare questa recensione.");
  }

  const prestazioneId = recensione.prestazione;
  const venditoreId = recensione.venditore;

  await Recensione.findByIdAndDelete(recensioneId);

  // Ricalcolo statistiche prestazione
  const recPrestazione = await Recensione.find({ prestazione: prestazioneId });
  const prestazione = await PrestazioneVenditore.findById(prestazioneId);

  if (prestazione) {
    if (recPrestazione.length > 0) {
      prestazione.recensioneMedia =
        recPrestazione.reduce((a, r) => a + r.voto, 0) / recPrestazione.length;
      prestazione.totaleRecensioni = recPrestazione.length;
    } else {
      prestazione.recensioneMedia = 0;
      prestazione.totaleRecensioni = 0;
    }
    await prestazione.save();
  }

  // Ricalcolo statistiche venditore
  const recVenditore = await Recensione.find({ venditore: venditoreId });
  const venditore = await Venditore.findById(venditoreId);

  if (venditore) {
    if (recVenditore.length > 0) {
      venditore.recensioneMedia =
        recVenditore.reduce((a, r) => a + r.voto, 0) / recVenditore.length;
      venditore.totaleRecensioni = recVenditore.length;
    } else {
      venditore.recensioneMedia = 0;
      venditore.totaleRecensioni = 0;
    }
    await venditore.save();
  }

  return true;
};
