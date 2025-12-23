// server/controllers/recensioniController.js

import {
  verificaPossibilitaRecensione,
  creaRecensioneService,
  recensioniPrestazioneService,
  recensioniVenditoreService,
  eliminaRecensioneService,
} from "../services/recensioniService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaRecensione = async (req, res) => {
  try {
    const { prestazioneId, voto, commento } = req.body;

    await verificaPossibilitaRecensione(req.utente._id, prestazioneId);

    const recensione = await creaRecensioneService({
      utenteId: req.utente._id,
      prestazioneId,
      voto,
      commento,
    });

    return successResponse(res, recensione);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const recensioniPrestazione = async (req, res) => {
  try {
    const rec = await recensioniPrestazioneService(req.params.id);
    return successResponse(res, rec);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const recensioniVenditore = async (req, res) => {
  try {
    const rec = await recensioniVenditoreService(req.params.id);
    return successResponse(res, rec);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaRecensione = async (req, res) => {
  try {
    await eliminaRecensioneService(req.utente._id, req.params.id, req.utente.ruolo);
    return successResponse(res, { message: "Recensione eliminata." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
