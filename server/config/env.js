// server/config/env.js
// Caricamento centralizzato delle variabili d'ambiente (ES Modules)

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Necessario per ottenere __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorso del file .env (che si trova nella root /web)
const envPath = path.resolve(__dirname, "../..", ".env");

// Carica il file .env
dotenv.config({ path: envPath });

// Controllo presenza variabili fondamentali
const requiredVars = [
  "MONGODB_URI",
  "DEEPL_API_KEY",
  "DEEPL_API_URL",
  "JWT_SECRET",
  "PORT"
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  ATTENZIONE: la variabile ${key} non è definita nel file .env`);
  }
});

console.log("✓ Variabili d'ambiente caricate correttamente");
