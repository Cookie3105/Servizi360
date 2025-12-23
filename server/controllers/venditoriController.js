// server/controllers/venditoriController.js

import {
  creaVenditoreService,
  getVenditoreLoggedService,
  aggiornaVenditoreService,
  venditoreByIdService,
  listaVenditoriService,
} from "../services/venditoriService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaVenditore = async (req, res) => {
  try {
    const venditore = await creaVenditoreService(req.utente._id, req.body);
    return successResponse(res, venditore);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const getVenditoreLogged = async (req, res) => {
  try {
    const venditore = await getVenditoreLoggedService(req.utente.venditoreId);
    return successResponse(res, venditore);
  } catch (err) {
    return errorResponse(res, 404, err.message);
  }
};

export const listaVenditori = async (req, res) => {
  try {
    const venditori = await listaVenditoriService();
    return successResponse(res, venditori);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const venditoreById = async (req, res) => {
  try {
    const venditore = await venditoreByIdService(req.params.id);
    if (!venditore) return errorResponse(res, 404, "Venditore non trovato.");
    return successResponse(res, venditore);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const aggiornaVenditore = async (req, res) => {
  try {
    const aggiornato = await aggiornaVenditoreService(
      req.utente.venditoreId,
      req.body
    );
    return successResponse(res, aggiornato);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
