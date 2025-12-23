// server/controllers/serviziController.js

import {
  listaServizi as listaServiziService,
  getServizioById as getServizioByIdService,
  creaServizioService,
  aggiornaServizioService,
  eliminaServizioService,
  popolaServiziService,
} from "../services/serviziService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const listaServizi = async (req, res) => {
  try {
    const servizi = await listaServiziService(req.query);
    return successResponse(res, servizi);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const getServizioById = async (req, res) => {
  try {
    const servizio = await getServizioByIdService(req.params.id);
    return successResponse(res, servizio);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};

export const creaServizio = async (req, res) => {
  try {
    const servizio = await creaServizioService(req.body);
    return successResponse(res, servizio);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const aggiornaServizio = async (req, res) => {
  try {
    const servizio = await aggiornaServizioService(req.params.id, req.body);
    return successResponse(res, servizio);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaServizio = async (req, res) => {
  try {
    await eliminaServizioService(req.params.id);
    return successResponse(res, { message: "Servizio eliminato." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const popolaServizi = async (req, res) => {
  try {
    const inseriti = await popolaServiziService(req.body.lista);
    return successResponse(res, inseriti);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
