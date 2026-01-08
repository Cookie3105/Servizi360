// server/models/Prestazione.js
// Modello Mongoose per prestazioni generiche legate ai servizi

import mongoose from "mongoose";

const PrestazioneSchema = new mongoose.Schema(
  {
    // Servizio principale a cui appartiene questa prestazione
    servizio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servizio",
      required: true,
    },

    // Nome della prestazione (es. "Taglio capelli", "Ritratto singolo")
    nome: {
      type: String,
      required: [true, "Il nome della prestazione è obbligatorio."],
      trim: true,
    },

    // Descrizione della prestazione
    descrizione: {
      type: String,
      default: "",
    },

    // Immagine rappresentativa
    immagine: {
      type: String,
      default: "",
    },

    // Durata stimata in minuti
    durata: {
      type: Number,
      default: null,
    },

    // Prezzo base consigliato
    prezzoBase: {
      type: Number,
      default: null,
    },

    // Tags utili per la ricerca avanzata
    tags: {
      type: [String],
      default: [],
    },

    attiva: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pulizia output
PrestazioneSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Prestazione", PrestazioneSchema);
