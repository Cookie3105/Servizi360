import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Parametri mancanti (text, targetLang)" });
  }

  try {
    const response = await axios.post(
      process.env.DEEPL_API_URL || "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text,
          target_lang: targetLang.toUpperCase(),
        },
      }
    );

    const tradotto = response.data.translations[0].text;
    res.json({ translated: tradotto });
  } catch (error) {
    console.error("❌ Errore DeepL:", error.response?.data || error.message);
    res.status(500).json({ error: "Errore durante la traduzione" });
  }
});

export default router;
