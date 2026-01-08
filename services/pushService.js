// server/services/pushService.js
// Versione SENZA Firebase — Modalità MOCK completamente funzionante

/**
 * Invia una notifica push simulata.
 * Viene usata perché Firebase non è configurato.
 *
 * Non causa errori e permette al server di funzionare al 100%.
 */

export const inviaNotificaPush = async (utenteId, payload) => {
  try {
    console.log(`
────────────────────────────────────────────
📢 NOTIFICA PUSH (SIMULATA)
Utente: ${utenteId}
Titolo: ${payload.titolo}
Messaggio: ${payload.corpo}
────────────────────────────────────────────
    `);

    return true;
  } catch (err) {
    console.error("❌ Errore mock inviaNotificaPush:", err);
    return false;
  }
};

/**
 * Recupero token push utente (non necessario in mock).
 * Restituisce sempre null.
 */
export const ottieniTokenPushUtente = async () => {
  return null;
};