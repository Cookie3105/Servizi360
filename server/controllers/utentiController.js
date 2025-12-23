// server/controllers/utentiController.js

import {
  listaUtenti as listaUtentiService,
  getUtente as getUtenteService,
  aggiornaUtenteService,
  aggiornaPreferenzeService,
  eliminaUtenteService,
} from "../services/utentiService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const listaUtenti = async (req, res) => {
  try {
    const utenti = await listaUtentiService();
    return successResponse(res, utenti);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const getUtenteById = async (req, res) => {
  try {
    const utente = await getUtenteService(req.params.id);
    if (!utente) return errorResponse(res, 404, "Utente non trovato.");
    return successResponse(res, utente);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const aggiornaUtente = async (req, res) => {
  try {
    const aggiornato = await aggiornaUtenteService(req.params.id, req.body);
    return successResponse(res, aggiornato);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const aggiornaPreferenze = async (req, res) => {
  try {
    const aggiornato = await aggiornaPreferenzeService(req.params.id, req.body);
    return successResponse(res, aggiornato);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const eliminaUtente = async (req, res) => {
  try {
    await eliminaUtenteService(req.params.id);
    return successResponse(res, { message: "Utente eliminato." });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
