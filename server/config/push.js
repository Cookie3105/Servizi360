// server/config/push.js
// Configurazione sistema notifiche push (Web Push + fallback mock)

import webpush from "web-push";

/**
 * CONFIGURAZIONE WEB PUSH
 * ------------------------
 * Per rendere tutto operativo servono:
 *
 * - PUBLIC_VAPID_KEY
 * - PRIVATE_VAPID_KEY
 *
 * Puoi generarli con:
 *     npx web-push generate-vapid-keys
 *
 * Puoi salvarli nel tuo file .env.
 */

if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    "mailto:" + (process.env.PUSH_CONTACT_EMAIL || "admin@sito.com"),
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );

  console.log("📡 Sistema Web Push configurato correttamente.");
} else {
  console.warn("⚠️  Chiavi VAPID mancanti. Le notifiche push reali sono disattivate.");
}

/**
 * Fallback mock per ambiente di sviluppo
 * ---------------------------------------
 * Se non hai ancora configurato WebPush, il tuo sistema non si rompe.
 */
export const sendMockPush = (payload) => {
  console.log("📨 [MOCK PUSH] Notifica inviata:", payload);
};

/**
 * Funzione universale invio notifica
 * ----------------------------------
 * Se WebPush è configurato → invia notifica reale
 * Altrimenti → usa mock
 */
export const sendPushNotification = async (subscription, data) => {
  try {
    if (!process.env.PUBLIC_VAPID_KEY || !process.env.PRIVATE_VAPID_KEY) {
      sendMockPush(data);
      return;
    }

    const payload = JSON.stringify(data);

    await webpush.sendNotification(subscription, payload);

    console.log("🔔 Notifica push inviata con successo!");

  } catch (error) {
    console.error("❌ Errore invio notifica push:", error.message);

    // Gestione errori specifici WebPush
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.warn("⚠️  Subscription scaduta o non valida.");
    }
  }
};
