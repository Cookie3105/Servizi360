// server/models/Prenotazione.js
import mongoose from "mongoose";

const PrenotazioneSchema = new mongoose.Schema(
  {
    // Chi ha prenotato (Utente/Cliente)
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },

    // Chi riceve la prenotazione (Venditore)
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Quale servizio (collegamento al Servizio, non Prestazione)
    servizio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servizio",
      required: true,
    },
    
    // Salviamo anche il nome e prezzo per comodità (snapshot)
    nomeServizio: { type: String },
    prezzo: { type: Number },

    // Data e Ora
    data: { type: String, required: true }, // es. "2024-05-20"
    ora: { type: String, required: true },  // es. "10:00"

    // Stato prenotazione
    stato: {
      type: String,
      enum: ["in_attesa", "confermata", "rifiutata", "completata"],
      default: "in_attesa",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prenotazione", PrenotazioneSchema);