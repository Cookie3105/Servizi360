// server/controllers/prestazioniVenditoriController.js

import {
  creaPrestazioneService,
  listaPrestazioniVenditoreService,
  getPrestazioneService,
  aggiornaPrestazioneService,
  eliminaPrestazioneService,
} from "../services/prestazioniVenditoriService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaPrestazione = async (req, res) => {
  try {
    const prestazione = await creaPrestazioneService(
      req.utente.venditoreId,
      req.body
    );
    return successResponse(res, prestazione);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const listaPrestazioniVenditore = async (req, res) => {
  try {
    const lista = await listaPrestazioniVenditoreService(req.utente.venditoreId);
    return successResponse(res, lista);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const getPrestazioneById = async (req, res) => {
  try {
    const prestazione = await getPrestazioneService(req.params.id);
    return successResponse(res, prestazione);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};

export const aggiornaPrestazione = async (req, res) => {
  try {
    const aggiornata = await aggiornaPrestazioneService(req.params.id, req.body);
    return successResponse(res, aggiornata);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaPrestazione = async (req, res) => {
  try {
    await eliminaPrestazioneService(req.params.id);
    return successResponse(res, { message: "Prestazione eliminata." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
