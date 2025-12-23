// server/models/PrestazioneVenditore.js
// Collegamento tra Venditore e Servizio – rappresenta la prestazione concreta offerta dal venditore

import mongoose from "mongoose";

const PrestazioneVenditoreSchema = new mongoose.Schema(
  {
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    servizio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servizio",
      required: true,
    },

    // Descrizione specifica del venditore
    descrizione: {
      type: String,
      default: "",
    },

    // Galleria immagini del venditore per quella prestazione
    immagini: {
      type: [String],
      default: [],
    },

    // Prezzo imposto dal venditore
    prezzo: {
      type: Number,
      required: true,
    },

    // Durata specifica indicata dal venditore (in minuti)
    durata: {
      type: Number,
      default: null,
    },

    // Media recensioni per questa prestazione del venditore
    recensioneMedia: {
      type: Number,
      default: 0,
    },

    totaleRecensioni: {
      type: Number,
      default: 0,
    },

    // Tags aggiuntivi inseriti dal venditore per migliorare la ricerca
    tags: {
      type: [String],
      default: [],
    },

    // Per mostrare quando l’ultima modifica è stata fatta
    ultimaModifica: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Aggiorna automaticamente il timestamp ultimaModifica
 */
PrestazioneVenditoreSchema.pre("save", function (next) {
  this.ultimaModifica = new Date();
  next();
});

/**
 * Pulizia output JSON
 */
PrestazioneVenditoreSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("PrestazioneVenditore", PrestazioneVenditoreSchema);
