// server/server.js
// Entry point backend completo

import express from "express";
import dotenv from "dotenv";
import { corsOptions } from "./config/cors.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import utentiRoutes from "./routes/utentiRoutes.js";
import venditoriRoutes from "./routes/venditoriRoutes.js";
import disponibilitaRoutes from "./routes/disponibilitaRoutes.js";
import offerteRoutes from "./routes/offerteRoutes.js";
import prenotazioniRoutes from "./routes/prenotazioniRoutes.js";
import prestazioniVenditoriRoutes from "./routes/prestazioniVenditoriRoutes.js";
import promozioniRoutes from "./routes/promozioniRoutes.js";
import recensioniRoutes from "./routes/recensioniRoutes.js";
import serviziRoutes from "./routes/serviziRoutes.js";
import serviziPopolaRoutes from "./routes/serviziPopolaRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import autocompleteRoutes from "./routes/autocompleteRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";

// Carica variabili ambiente
dotenv.config();

// Crea app Express
const app = express();

// Middlewares globali
// ===== CORS =====
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight per tutte le route

// Header extra per sicurezza
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // Se è una preflight, rispondi subito
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test server
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server attivo 🚀" });
});

// ROUTE PRINCIPALI
app.use("/api/auth", authRoutes);
app.use("/api/utenti", utentiRoutes);
app.use("/api/venditori", venditoriRoutes);
app.use("/api/disponibilita", disponibilitaRoutes);
app.use("/api/offerte", offerteRoutes);
app.use("/api/prenotazioni", prenotazioniRoutes);
app.use("/api/prestazioni-venditori", prestazioniVenditoriRoutes);
app.use("/api/promozioni", promozioniRoutes);
app.use("/api/recensioni", recensioniRoutes);
app.use("/api/servizi", serviziRoutes);
app.use("/api/servizi/popola", serviziPopolaRoutes);
app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api", searchRoutes);
app.use("/api", homeRoutes);

// Middleware gestione errori globali
app.use(errorHandler);

// Avvio server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
