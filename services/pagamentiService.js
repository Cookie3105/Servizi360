// server/services/pagamentiService.js
// Logica centralizzata per la gestione dei pagamenti con Stripe

import Stripe from "stripe";
import Prenotazione from "../models/Prenotazione.js";
import Offerta from "../models/Offerta.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Calcola il prezzo finale applicando eventuali offerte attive
 */
export const calcolaPrezzoFinale = async (prestazioneId, prezzoBase) => {
  const now = new Date();

  const offerta = await Offerta.findOne({
    prestazione: prestazioneId,
    attiva: true,
    dataInizio: { $lte: now },
    dataFine: { $gte: now },
  });

  if (!offerta) return prezzoBase;

  if (offerta.prezzoScontato) return offerta.prezzoScontato;

  if (offerta.percentualeSconto) {
    return prezzoBase - (prezzoBase * offerta.percentualeSconto) / 100;
  }

  return prezzoBase;
};

/**
 * Crea PaymentIntent Stripe
 */
export const creaPaymentIntentService = async (prenotazioneId) => {
  const prenotazione = await Prenotazione.findById(prenotazioneId)
    .populate("prestazione")
    .populate("venditore");

  if (!prenotazione) throw new Error("Prenotazione non trovata.");

  const prestazione = prenotazione.prestazione;

  let prezzoFinale = await calcolaPrezzoFinale(
    prestazione._id,
    prenotazione.prezzoTotale
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(prezzoFinale * 100), // centesimi
    currency: "eur",
    metadata: {
      prenotazioneId: prenotazione._id.toString(),
      utenteId: prenotazione.utente.toString(),
    },
  });

  return { paymentIntent, prezzoFinale };
};

/**
 * Conferma pagamento controllando lo stato su Stripe
 */
export const confermaPagamentoService = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    throw new Error("PaymentIntent non trovato.");
  }

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Il pagamento non è completato.");
  }

  const prenotazioneId = paymentIntent.metadata.prenotazioneId;

  const prenotazioneAggiornata = await Prenotazione.findByIdAndUpdate(
    prenotazioneId,
    {
      pagamento: {
        metodo: "stripe",
        transazioneId: paymentIntent.id,
        pagato: true,
      },
      stato: "confermata",
    },
    { new: true }
  );

  return prenotazioneAggiornata;
};

/**
 * Gestione evento webhook Stripe (solo logica, il controller la chiama)
 */
export const gestisciWebhookService = async (evento) => {
  if (evento.type === "payment_intent.succeeded") {
    const paymentIntent = evento.data.object;
    const prenotazioneId = paymentIntent.metadata.prenotazioneId;

    await Prenotazione.findByIdAndUpdate(prenotazioneId, {
      pagamento: {
        metodo: "stripe",
        transazioneId: paymentIntent.id,
        pagato: true,
      },
      stato: "confermata",
    });

    return true;
  }

  return false;
};
