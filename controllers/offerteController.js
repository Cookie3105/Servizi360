// server/controllers/offerteController.js

import {
  creaOffertaService,
  aggiornaOffertaService,
  eliminaOffertaService,
  offerteVenditoreService,
  offerteAttiveService,
  getOffertaByIdService,
} from "../services/offerteService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaOfferta = async (req, res) => {
  try {
    const offerta = await creaOffertaService(req.utente.venditoreId, req.body);
    return successResponse(res, offerta);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const offerteVenditore = async (req, res) => {
  try {
    const offerte = await offerteVenditoreService(req.utente.venditoreId);
    return successResponse(res, offerte);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const offerteAttive = async (req, res) => {
  try {
    const offerte = await offerteAttiveService();
    return successResponse(res, offerte);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const getOffertaById = async (req, res) => {
  try {
    const offerta = await getOffertaByIdService(req.params.id);
    return successResponse(res, offerta);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};

export const aggiornaOfferta = async (req, res) => {
  try {
    const aggiornata = await aggiornaOffertaService(req.params.id, req.body);
    return successResponse(res, aggiornata);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaOfferta = async (req, res) => {
  try {
    await eliminaOffertaService(req.params.id);
    return successResponse(res, { message: "Offerta eliminata." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
