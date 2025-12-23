// server/controllers/prenotazioniController.js

import {
  creaPrenotazioneService,
  prenotazioniUtenteService,
  prenotazioniVenditoreService,
  aggiornaStatoPrenotazioneService,
  getPrenotazioneByIdService,
} from "../services/prenotazioniService.js";

import {
  inviaEmailConferma,
  inviaEmailFallita,
} from "../services/emailService.js";

import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Crea prenotazione + email di conferma
 */
export const creaPrenotazione = async (req, res) => {
  try {
    const { prestazioneId, data, ora, note } = req.body;

    const risultato = await creaPrenotazioneService({
      utenteId: req.utente._id,
      prestazioneId,
      data,
      ora,
      note,
    });

    const { prenotazione, venditore } = risultato;

    await inviaEmailConferma(prenotazione, venditore);

    return successResponse(res, prenotazione);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

/**
 * Lista prenotazioni utente
 */
export const listaPrenotazioniUtente = async (req, res) => {
  try {
    const prenotazioni = await prenotazioniUtenteService(req.utente._id);
    return successResponse(res, prenotazioni);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

/**
 * Lista prenotazioni venditore
 */
export const listaPrenotazioniVenditore = async (req, res) => {
  try {
    const prenotazioni = await prenotazioniVenditoreService(req.utente._id);
    return successResponse(res, prenotazioni);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

/**
 * Aggiorna stato prenotazione
 */
export const aggiornaStatoPrenotazione = async (req, res) => {
  try {
    const prenotazione = await aggiornaStatoPrenotazioneService(
      req.params.id,
      req.body.stato
    );

    return successResponse(res, prenotazione);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

/**
 * 🔥 Ottiene una singola prenotazione tramite ID
 */
export const getPrenotazioneById = async (req, res) => {
  try {
    const prenotazione = await getPrenotazioneByIdService(req.params.id);
    return successResponse(res, prenotazione);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};
