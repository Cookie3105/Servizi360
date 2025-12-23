// server/services/notificheService.js
// Logica centralizzata per notifiche interne, push ed email

import Notifica from "../models/Notifica.js";
import { inviaNotificaPush } from "../services/pushService.js";
import { inviaEmailGenerica } from "../services/emailService.js";

/**
 * Crea una notifica interna
 */
export const creaNotificaInterna = async ({ utenteId, titolo, messaggio }) => {
  const notifica = await Notifica.create({
    utente: utenteId,
    titolo,
    messaggio,
  });

  return notifica;
};

/**
 * Crea una notifica interna + push opzionale
 */
export const creaNotificaCompleta = async ({
  utenteId,
  titolo,
  messaggio,
  push = false,
}) => {
  const notifica = await creaNotificaInterna({
    utenteId,
    titolo,
    messaggio,
  });

  if (push) {
    await inviaNotificaPush(utenteId, {
      titolo,
      corpo: messaggio,
    });
  }

  return notifica;
};

/**
 * Invia una notifica email
 */
export const inviaNotificaEmail = async (email, soggetto, contenuto) => {
  await inviaEmailGenerica(email, soggetto, contenuto);
  return true;
};

/**
 * Ottiene tutte le notifiche di un utente
 */
export const getNotificheUtenteService = async (utenteId) => {
  return await Notifica.find({ utente: utenteId }).sort({ createdAt: -1 });
};

/**
 * Elimina una notifica
 */
export const eliminaNotificaService = async (utenteId, notificaId) => {
  const notifica = await Notifica.findById(notificaId);

  if (!notifica) {
    throw new Error("Notifica non trovata.");
  }

  if (notifica.utente.toString() !== utenteId.toString()) {
    throw new Error("Non autorizzato a eliminare questa notifica.");
  }

  await Notifica.findByIdAndDelete(notificaId);
  return true;
};
