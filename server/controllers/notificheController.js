// server/controllers/notificheController.js
// Gestione notifiche sistema: push, interne, email

import { successResponse, errorResponse } from "../utils/response.js";
import { inviaNotificaPush } from "../services/pushService.js";
import { inviaEmailGenerica } from "../services/emailService.js";
import Notifica from "../models/Notifica.js";

/**
 * @route GET /api/notifiche
 * @desc Recupera le notifiche interne dell'utente loggato
 */
export const getNotificheUtente = async (req, res) => {
  try {
    const notifiche = await Notifica.find({ utente: req.user.id })
      .sort({ createdAt: -1 });

    return successResponse(res, { notifiche });
  } catch (err) {
    console.error("❌ Errore getNotificheUtente:", err);
    return errorResponse(res, 500, "Errore durante il recupero delle notifiche.");
  }
};

/**
 * @route POST /api/notifiche
 * @desc Crea una notifica interna + push opzionale
 */
export const creaNotifica = async (req, res) => {
  try {
    const { titolo, messaggio, utenteId, push = false } = req.body;

    if (!titolo || !messaggio || !utenteId) {
      return errorResponse(res, 400, "Dati notifica mancanti.");
    }

    // Salva notifica interna
    const notifica = await Notifica.create({
      titolo,
      messaggio,
      utente: utenteId,
    });

    // Invia push se richiesto
    if (push) {
      await inviaNotificaPush(utenteId, {
        titolo,
        corpo: messaggio,
      });
    }

    return successResponse(res, {
      message: "Notifica inviata.",
      notifica,
    });
  } catch (err) {
    console.error("❌ Errore creaNotifica:", err);
    return errorResponse(res, 500, "Errore creazione notifica.");
  }
};

/**
 * @route POST /api/notifiche/email
 * @desc Invia una email generica all'utente
 */
export const inviaEmailNotifica = async (req, res) => {
  try {
    const { utenteEmail, soggetto, contenuto } = req.body;

    if (!utenteEmail || !soggetto || !contenuto) {
      return errorResponse(res, 400, "Dati email incompleti.");
    }

    await inviaEmailGenerica(utenteEmail, soggetto, contenuto);

    return successResponse(res, {
      message: "Email inviata correttamente.",
    });
  } catch (err) {
    console.error("❌ Errore inviaEmailNotifica:", err);
    return errorResponse(res, 500, "Errore invio email.");
  }
};

/**
 * @route DELETE /api/notifiche/:id
 * @desc Elimina una notifica interna
 */
export const eliminaNotifica = async (req, res) => {
  try {
    const notifica = await Notifica.findById(req.params.id);

    if (!notifica) {
      return errorResponse(res, 404, "Notifica non trovata.");
    }

    // L’utente può eliminare solo le proprie notifiche
    if (notifica.utente.toString() !== req.user.id) {
      return errorResponse(res, 403, "Non puoi eliminare questa notifica.");
    }

    await Notifica.findByIdAndDelete(req.params.id);

    return successResponse(res, { message: "Notifica eliminata." });
  } catch (err) {
    console.error("❌ Errore eliminaNotifica:", err);
    return errorResponse(res, 500, "Errore eliminazione notifica.");
  }
};
