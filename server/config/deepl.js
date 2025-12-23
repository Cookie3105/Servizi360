// server/config/deepl.js
// Wrapper per effettuare traduzioni automatiche tramite DeepL API

import axios from "axios";

// Verifica presenza variabili DeepL
if (!process.env.DEEPL_API_KEY || !process.env.DEEPL_API_URL) {
  console.warn("⚠️  DeepL non configurato correttamente: DEEPL_API_KEY o DEEPL_API_URL mancanti");
}

/**
 * Funzione per tradurre testo tramite DeepL
 * @param {string} text - Testo originale da tradurre
 * @param {string} targetLang - Lingua di arrivo (es. "EN", "ES", "FR", "DE", "IT")
 * @returns {Promise<string>} - Testo tradotto
 */
export const translateText = async (text, targetLang = "EN") => {
  try {
    if (!text || text.trim().length === 0) {
      return "";
    }

    const params = new URLSearchParams();
    params.append("auth_key", process.env.DEEPL_API_KEY);
    params.append("text", text);
    params.append("target_lang", targetLang.toUpperCase());

    const response = await axios.post(process.env.DEEPL_API_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (
      response.data &&
      response.data.translations &&
      response.data.translations.length > 0
    ) {
      return response.data.translations[0].text;
    }

    console.warn("⚠️ DeepL: risposta inattesa", response.data);
    return text;

  } catch (error) {
    console.error("❌ Errore DeepL:", error.message);
    return text; // fallback → mostra il testo originale
  }
};
