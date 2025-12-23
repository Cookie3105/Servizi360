// server/services/serviziService.js
// Logica di business legata ai Servizi

import Servizio from "../models/Servizio.js";
import Venditore from "../models/Venditore.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";

/**
 * Lista filtrata dei servizi
 */
export const listaServizi = async (filtri) => {
  const query = {};

  if (filtri.nome)
    query.nome = new RegExp(filtri.nome.trim(), "i");

  if (filtri.categoria)
    query.categoria = filtri.categoria;

  if (filtri.tag)
    query.tags = { $in: [filtri.tag] };

  return await Servizio.find(query);
};

/**
 * Ottiene un servizio tramite ID
 */
export const getServizioById = async (id) => {
  const servizio = await Servizio.findById(id);

  if (!servizio) throw new Error("Servizio non trovato.");

  return servizio;
};

/**
 * Crea un nuovo servizio
 */
export const creaServizioService = async (dati) => {
  const servizio = await Servizio.create(dati);
  return servizio;
};

/**
 * Aggiorna un servizio esistente
 */
export const aggiornaServizioService = async (id, dati) => {
  const servizio = await Servizio.findByIdAndUpdate(id, dati, {
    new: true,
  });

  if (!servizio) throw new Error("Servizio non trovato.");

  return servizio;
};

/**
 * Elimina un servizio
 */
export const eliminaServizioService = async (id) => {
  const servizio = await Servizio.findById(id);

  if (!servizio) throw new Error("Servizio non trovato.");

  // Rimuove il servizio da tutti i venditori collegati
  await Venditore.updateMany(
    { venditori: servizio._id },
    { $pull: { venditori: servizio._id } }
  );

  await Servizio.findByIdAndDelete(id);

  return true;
};

/**
 * Ricerca avanzata servizi + venditori + filtri
 * (logica interna del searchController)
 */
export const ricercaAvanzataService = async (parametri) => {
  const { query, categoria } = parametri;

  const filtri = {};

  if (query) {
    filtri.$or = [
      { nome: new RegExp(query, "i") },
      { descrizione: new RegExp(query, "i") },
      { tags: { $in: [query.toLowerCase()] } },
    ];
  }

  if (categoria) filtri.categoria = categoria;

  const servizi = await Servizio.find(filtri).populate("venditori");

  return servizi;
};

/**
 * Popola il database con servizi iniziali
 */
export const popolaServiziService = async (lista) => {
  if (!lista || lista.length === 0)
    throw new Error("Lista servizi vuota.");

  return await Servizio.insertMany(lista);
};

