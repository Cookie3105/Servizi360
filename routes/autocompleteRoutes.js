import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Otteniamo percorso reale del file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Cartella DATA sempre corretta:
// web/server/routes → .. = web/server
// web/server → .. = web
// web → /data = web/data
const dataDir = path.resolve(__dirname, "..", "..", "data");

console.log("📂 DATA DIR:", dataDir); // DEBUG

// Helper lettura CSV
function leggiCsv(nomeFile, res) {
  const filePath = path.join(dataDir, nomeFile);

  console.log("🔎 Leggo CSV:", filePath); // DEBUG

  if (!fs.existsSync(filePath)) {
    console.error("❌ CSV NON TROVATO:", filePath);
    return res.status(500).json([]);
  }

  try {
    const righe = fs
      .readFileSync(filePath, "utf8")
      .split("\n")
      .map(r => r.trim())
      .filter(r => r);

    return res.json(righe);
  } catch (err) {
    console.error("❌ Errore lettura CSV:", err);
    return res.status(500).json([]);
  }
}

// AUTOCOMPLETE CITTÀ
router.get("/citta", (req, res) => {
  leggiCsv("comuni_italiani.csv", res);
});

// AUTOCOMPLETE SERVIZI
router.get("/servizi", (req, res) => {
  leggiCsv("mestieri.csv", res);
});

export default router;
