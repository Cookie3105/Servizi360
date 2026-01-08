// server/controllers/promozioniController.js

import {
  creaPromozioneService,
  aggiornaPromozioneService,
  eliminaPromozioneService,
  listaPromozioniService,
  promozioniAttiveService,
  getPromozioneByIdService,
} from "../services/promozioniService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaPromozione = async (req, res) => {
  try {
    const promo = await creaPromozioneService(req.body);
    return successResponse(res, promo);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const listaPromozioni = async (req, res) => {
  try {
    const promo = await listaPromozioniService();
    return successResponse(res, promo);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const promozioniAttive = async (req, res) => {
  try {
    const promo = await promozioniAttiveService();
    return successResponse(res, promo);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const getPromozioneById = async (req, res) => {
  try {
    const promo = await getPromozioneByIdService(req.params.id);
    return successResponse(res, promo);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};

export const aggiornaPromozione = async (req, res) => {
  try {
    const promo = await aggiornaPromozioneService(req.params.id, req.body);
    return successResponse(res, promo);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaPromozione = async (req, res) => {
  try {
    await eliminaPromozioneService(req.params.id);
    return successResponse(res, { message: "Promozione eliminata." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
