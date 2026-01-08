// server/services/emailService.js
// Gestione email: conferme, errori, notifiche

import { emailTransporter } from "../config/email.js";

/**
 * Utility per template email HTML
 */
const templateEmail = (titolo, messaggio) => `
  <div style="font-family:Arial, sans-serif; padding:20px; color:#333;">
    <h2 style="color:#2E5E4E;">${titolo}</h2>
    <p style="font-size:16px; line-height:1.6;">${messaggio}</p>

    <br/><br/>
    <hr style="border:none; border-top:1px solid #ddd;">
    <p style="font-size:12px; color:#777;">
      Email inviata automaticamente dal sistema Servizi360.
    </p>
  </div>
`;

/**
 * Invia email generica
 */
export const inviaEmailGenerica = async (destinatario, soggetto, contenuto) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: destinatario,
      subject: soggetto,
      html: contenuto,
    });
    return true;
  } catch (err) {
    console.error("❌ Errore inviaEmailGenerica:", err);
    throw new Error("Errore nell'invio email generica.");
  }
};

/**
 * Email di conferma prenotazione
 */
export const inviaEmailConferma = async (prenotazione, venditore) => {
  try {
    const contenuto = templateEmail(
      "La tua prenotazione è confermata!",
      `
      Ciao,<br><br>
      La tua prenotazione è stata confermata.<br><br>

      <strong>Dettagli Prenotazione:</strong><br>
      • Venditore: <strong>${venditore.nomeAttivita}</strong><br>
      • Data: <strong>${new Date(prenotazione.data).toLocaleDateString()}</strong><br>
      • Ora: <strong>${prenotazione.ora}</strong><br>
      • Prezzo: <strong>${prenotazione.prezzoTotale}€</strong><br><br>

      Grazie per aver scelto Servizi360! 😊
      `
    );

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: prenotazione.utenteEmail,
      subject: "📩 Prenotazione Confermata",
      html: contenuto,
    });

    return true;
  } catch (err) {
    console.error("❌ Errore inviaEmailConferma:", err);
    throw new Error("Errore nell'invio email di conferma.");
  }
};

/**
 * Email prenotazione fallita
 */
export const inviaEmailFallita = async (utenteEmail, venditore, prestazione, data, ora) => {
  try {
    const contenuto = templateEmail(
      "Prenotazione non riuscita",
      `
      Ciao,<br><br>
      Purtroppo la tua prenotazione non è stata completata.<br><br>

      <strong>Dettagli Tentativo:</strong><br>
      • Venditore: ${venditore.nomeAttivita}<br>
      • Servizio: ${prestazione.descrizione}<br>
      • Data: ${new Date(data).toLocaleDateString()}<br>
      • Ora: ${ora}<br><br>

      Ti invitiamo a scegliere un nuovo orario disponibile.
      `
    );

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: utenteEmail,
      subject: "⚠️ Prenotazione Non Riuscita",
      html: contenuto,
    });

    return true;
  } catch (err) {
    console.error("❌ Errore inviaEmailFallita:", err);
    throw new Error("Errore invio email fallita.");
  }
};

/**
 * Email nuova prenotazione ricevuta dal venditore
 */
export const inviaEmailNuovaPrenotazioneVenditore = async (venditoreEmail, prenotazione) => {
  try {
    const contenuto = templateEmail(
      "Hai ricevuto una nuova prenotazione!",
      `
      Hai una nuova prenotazione da un cliente.<br><br>

      <strong>Dettagli:</strong><br>
      • Data: ${new Date(prenotazione.data).toLocaleDateString()}<br>
      • Ora: ${prenotazione.ora}<br>
      • Prezzo: ${prenotazione.prezzoTotale}€<br><br>

      Accedi al tuo pannello venditore per gestirla.
      `
    );

    await emailTransporter.sendMail({
      from: process.process.env.EMAIL_FROM,
      to: venditoreEmail,
      subject: "📆 Nuova Prenotazione Ricevuta",
      html: contenuto,
    });

    return true;
  } catch (err) {
    console.error("❌ Errore inviaEmailNuovaPrenotazioneVenditore:", err);
    throw new Error("Errore invio email al venditore.");
  }
};
