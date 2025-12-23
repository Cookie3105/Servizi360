// server/models/Venditore.js
// Modello Mongoose

import mongoose from "mongoose";

const VenditoreSchema = new mongoose.Schema(
  {
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },

    nomeAttivita: {
      type: String,
      required: [true, "Il nome dell'attività è obbligatorio."],
      trim: true,
    },

    categoria: {
      type: String,
      required: [true, "La categoria professionale è obbligatoria."],
      trim: true,
    },

    sottocategorie: {
      type: [String],
      default: [],
    },

    descrizione: {
      type: String,
      default: "",
    },

    indirizzo: {
      via: { type: String, default: "" },
      citta: { type: String, default: "" },
      cap: { type: String, default: "" },
      coordinate: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },

    telefono: {
      type: String,
      default: "",
    },

    emailContatto: {
      type: String,
      lowercase: true,
      trim: true,
    },

    immagineProfilo: {
      type: String,
      default: "",
    },

    recensioneMedia: {
      type: Number,
      default: 0,
    },

    totaleRecensioni: {
      type: Number,
      default: 0,
    },

    posizioneTop100: {
      type: Number,
      default: null,
    },

    prezzoMedio: {
      type: Number,
      default: null,
    },

    disponibilita: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disponibilita",
      },
    ],

    prestazioni: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrestazioneVenditore",
      },
    ],

    verificato: {
      type: Boolean,
      default: false,
    },

    preferenzeNotifiche: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Rimozione campi non utili dall’output
VenditoreSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Venditore", VenditoreSchema);
