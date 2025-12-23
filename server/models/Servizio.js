// server/models/Servizio.js
// Modello Mongoose

import mongoose from "mongoose";

const ServizioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Il nome del servizio è obbligatorio."],
      trim: true,
    },

    descrizione: {
      type: String,
      default: "",
    },

    categoria: {
      type: String,
      required: [true, "La categoria è obbligatoria."],
      trim: true,
    },

    icona: {
      type: String,
      default: "",
    },

    immagine: {
      type: String,
      default: "",
    },

    // Venditori che offrono questo servizio
    venditori: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venditore",
      },
    ],

    // Statistiche globali (aggregate)
    prezzoMedioGlobale: {
      type: Number,
      default: null,
    },

    recensioneMediaGlobale: {
      type: Number,
      default: null,
    },

    totaleRecensioniGlobali: {
      type: Number,
      default: 0,
    },

    // Tag per ricerca avanzata
    tags: {
      type: [String],
      default: [],
    },

    attivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pulizia output JSON
ServizioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Servizio", ServizioSchema);
