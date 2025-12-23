// server/services/utentiService.js
// Logica di business per utenti

import Utente from "../models/Utente.js";

/**
 * Recupera tutti gli utenti (admin)
 */
export const listaUtenti = async () => {
  return await Utente.find().select("-password");
};

/**
 * Recupera un utente per ID
 */
export const getUtente = async (id) => {
  return await Utente.findById(id).select("-password");
};

/**
 * Aggiorna dati utente
 */
export const aggiornaUtenteService = async (id, dati) => {
  const utente = await Utente.findByIdAndUpdate(id, dati, {
    new: true,
  }).select("-password");

  if (!utente) throw new Error("Utente non trovato.");

  return utente;
};

/**
 * Aggiorna preferenze utente
 */
export const aggiornaPreferenzeService = async (id, preferenze) => {
  const utente = await Utente.findByIdAndUpdate(
    id,
    {
      "preferenze.lingua": preferenze.lingua,
      "preferenze.notificheEmail": preferenze.notificheEmail,
      "preferenze.notifichePush": preferenze.notifichePush,
    },
    { new: true }
  ).select("-password");

  if (!utente) throw new Error("Utente non trovato.");

  return utente;
};

/**
 * Elimina un utente
 */
export const eliminaUtenteService = async (id) => {
  const utente = await Utente.findByIdAndDelete(id);

  if (!utente) throw new Error("Utente non trovato.");

  return true;
};
