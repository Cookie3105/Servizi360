// server/server.js - VERSIONE CORRETTA CON CORS E NOTIFICHE
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Configurazione
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { corsOptions } from "./config/cors.js"; // <--- ORA USIAMO IL TUO FILE!

// 2. Importazione Rotte
import authRoutes from "./routes/authRoutes.js";
import utentiRoutes from "./routes/utentiRoutes.js";
import venditoriRoutes from "./routes/venditoriRoutes.js";
import serviziRoutes from "./routes/serviziRoutes.js";
import prestazioniVenditoriRoutes from "./routes/prestazioniVenditoriRoutes.js";
import offerteRoutes from "./routes/offerteRoutes.js";
import promozioniRoutes from "./routes/promozioniRoutes.js";
import prenotazioniRoutes from "./routes/prenotazioniRoutes.js";
import recensioniRoutes from "./routes/recensioniRoutes.js";
import notificheRoutes from "./routes/notificheRoutes.js"; // <--- NUOVA ROTTA

import searchRoutes from "./routes/searchRoutes.js";
import traduzioneRoutes from "./routes/traduzioneRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import autocompleteRoutes from "./routes/autocompleteRoutes.js";
import disponibilitaRoutes from "./routes/disponibilitaRoutes.js";

// Setup Ambiente
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware Base
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================================================
// CONFIGURAZIONE CORS (Integra il tuo file cors.js)
// =========================================================
// Se sei in locale e hai problemi, puoi commentare la riga sotto
// e usare: app.use(cors({ origin: "*" }));
app.use(cors(corsOptions)); 

// Logging semplice
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Connessione Database
connectDB();

// 4. Mounting delle Rotte
app.use("/api/auth", authRoutes);
app.use("/api/utenti", utentiRoutes);
app.use("/api/venditori", venditoriRoutes);
app.use("/api/servizi", serviziRoutes);
app.use("/api/prestazioni-venditori", prestazioniVenditoriRoutes);
app.use("/api/offerte", offerteRoutes);
app.use("/api/promozioni", promozioniRoutes);
app.use("/api/prenotazioni", prenotazioniRoutes);
app.use("/api/recensioni", recensioniRoutes);
app.use("/api/notifiche", notificheRoutes); // <--- ATTIVATO!
app.use("/api/disponibilita", disponibilitaRoutes);

// Feature & Utility Routes
app.use("/api", searchRoutes);
app.use("/api/traduci", traduzioneRoutes);
app.use("/api", homeRoutes);
app.use("/api/autocomplete", autocompleteRoutes);

// Rotta di test base
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server API collegato e funzionante! 🚀" });
});

// 5. Gestione Errori
app.use(notFound);
app.use(errorHandler);

// 6. Avvio Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SERVER AVVIATO SU PORTA ${PORT}`);
  console.log(`👉 API disponibili su: http://localhost:${PORT}/api/test`);
});