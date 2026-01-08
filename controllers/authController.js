// server/controllers/authController.js

import { successResponse, errorResponse } from "../utils/response.js";
import { generaToken } from "../utils/generaToken.js";
import Utente from "../models/Utente.js";
import bcrypt from "bcryptjs";

export const registraUtente = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    const esiste = await Utente.findOne({ email });
    if (esiste) return errorResponse(res, 400, "Email già registrata.");

    const nuovo = await Utente.create({ nome, email, password });

    return successResponse(res, {
      message: "Registrazione completata",
      utente: nuovo,
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const loginUtente = async (req, res) => {
  try {
    const { email, password } = req.body;

    const utente = await Utente.findOne({ email });
    if (!utente) return errorResponse(res, 400, "Credenziali non valide.");

    const passwordValida = await bcrypt.compare(password, utente.password);
    if (!passwordValida) return errorResponse(res, 400, "Credenziali non valide.");

    const token = generaToken(utente);

    return successResponse(res, {
      message: "Login effettuato",
      token,
      utente,
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export const profiloUtente = async (req, res) => {
  try {
    const utente = await Utente.findById(req.utente._id);
    if (!utente) return errorResponse(res, 404, "Utente non trovato.");

    return successResponse(res, utente);
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};
