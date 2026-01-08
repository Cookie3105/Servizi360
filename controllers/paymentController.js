// server/controllers/paymentController.js

import {
  creaPaymentIntentService,
  confermaPagamentoService
} from "../services/pagamentiService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const creaPagamento = async (req, res) => {
  try {
    const { prenotazioneId } = req.body;
    const risultato = await creaPaymentIntentService(prenotazioneId);
    return successResponse(res, risultato);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};

export const confermaPagamento = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const prenotazione = await confermaPagamentoService(paymentIntentId);
    return successResponse(res, prenotazione);
  } catch (err) {
    return errorResponse(res, 400, err.message);
  }
};
