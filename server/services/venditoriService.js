// server/services/venditoriService.js
// Gestione logica venditori: creazione, update, profilo, listing

import Venditore from "../models/Venditore.js";
import Utente from "../models/Utente.js";

/**
 * 📌 CREA PROFILO VENDITORE
 */
export const creaVenditoreService = async (utenteId, dati) => {
  const esiste = await Venditore.findOne({ utente: utenteId });

  if (esiste) throw new Error("Hai già un profilo venditore.");

  const nuovoVenditore = await Venditore.create({
    utente: utenteId,
    nomeAttivita: dati.nomeAttivita,
    categoria: dati.categoria,
    descrizione: dati.descrizione || "",
    sottocategorie: dati.sottocategorie || [],
    indirizzo: dati.indirizzo || {},
    telefono: dati.telefono || "",
    emailContatto: dati.emailContatto || "",
    immagineProfilo: dati.immagineProfilo || "",
  });

  return nuovoVenditore;
};

/**
 * 📌 PROFILO VENDITORE LOGGATO
 */
export const getVenditoreLoggedService = async (venditoreId) => {
  const venditore = await Venditore.findById(venditoreId)
    .populate("prestazioni")
    .populate("disponibilita");

  if (!venditore) throw new Error("Profilo venditore non trovato.");

  return venditore;
};

/**
 * 📌 LISTA COMPLETA VENDITORI (pubblico)
 */
export const listaVenditoriService = async () => {
  const venditori = await Venditore.find()
    .populate("prestazioni")
    .populate("disponibilita");

  return venditori;
};

/**
 * 📌 OTTIENI VENDITORE PER ID
 */
export const venditoreByIdService = async (id) => {
  const venditore = await Venditore.findById(id)
    .populate("prestazioni")
    .populate("disponibilita");

  if (!venditore) throw new Error("Venditore non trovato.");

  return venditore;
};

/**
 * 📌 AGGIORNA PROFILO VENDITORE
 */
export const aggiornaVenditoreService = async (venditoreId, dati) => {
  const venditore = await Venditore.findByIdAndUpdate(
    venditoreId,
    dati,
    { new: true }
  );

  if (!venditore) throw new Error("Venditore non trovato.");

  return venditore;
};
