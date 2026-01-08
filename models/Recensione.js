// server/models/Recensione.js
// Modello Mongoose
// Gestisce recensioni, voti e commenti degli utenti verso i venditori

import mongoose from "mongoose";

const RecensioneSchema = new mongoose.Schema(
  {
    // Utente che scrive la recensione
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },

    // Venditore recensito
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Prestazione a cui si riferisce la recensione
    prestazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrestazioneVenditore",
      required: true,
    },

    // Voto da 1 a 10
    voto: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    // Testo della recensione
    commento: {
      type: String,
      default: "",
    },

    // Data recensione
    dataRecensione: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pulizia output JSON
 */
RecensioneSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Recensione", RecensioneSchema);
