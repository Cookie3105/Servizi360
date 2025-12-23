// server/controllers/disponibilitaController.js

import {
  creaDisponibilitaService,
  listaDisponibilitaVenditoreService,
  aggiornaDisponibilitaService,
  eliminaDisponibilitaService
} from "../services/disponibilitaService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaDisponibilita = async (req, res) => {
  try {
    const disp = await creaDisponibilitaService(req.utente.venditoreId, req.body);
    return successResponse(res, disp);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const listaDisponibilitaVenditore = async (req, res) => {
  try {
    const lista = await listaDisponibilitaVenditoreService(req.utente.venditoreId);
    return successResponse(res, lista);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const aggiornaDisponibilita = async (req, res) => {
  try {
    const aggiornata = await aggiornaDisponibilitaService(req.params.id, req.body);
    return successResponse(res, aggiornata);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const eliminaDisponibilita = async (req, res) => {
  try {
    await eliminaDisponibilitaService(req.params.id);
    return successResponse(res, { message: "Disponibilità eliminata." });
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
