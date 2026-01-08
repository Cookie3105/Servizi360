// server/models/Offerta.js
// Modello Mongoose
// Gestisce sconti e promozioni specifiche dei venditori

import mongoose from "mongoose";

const OffertaSchema = new mongoose.Schema(
  {
    // Venditore che crea la promozione
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Prestazione interessata dall’offerta (opzionale)
    prestazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrestazioneVenditore",
      default: null,
    },

    // Titolo dell’offerta
    titolo: {
      type: String,
      required: [true, "Il titolo dell'offerta è obbligatorio."],
    },

    // Descrizione dell’offerta
    descrizione: {
      type: String,
      default: "",
    },

    // Percentuale di sconto (es: 20 per 20%)
    percentualeSconto: {
      type: Number,
      default: null,
    },

    // Prezzo scontato fisso (alternativo alla percentuale)
    prezzoScontato: {
      type: Number,
      default: null,
    },

    // Data da cui l’offerta è attiva
    dataInizio: {
      type: Date,
      required: true,
    },

    // Data in cui l’offerta termina
    dataFine: {
      type: Date,
      required: true,
    },

    // Tag associati all’offerta (es: “Natale”, “Promo”)
    tags: {
      type: [String],
      default: [],
    },

    // Può essere disattivata manualmente
    attiva: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pulizia output JSON
 */
OffertaSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * Controlla se l’offerta è valida ora
 */
OffertaSchema.methods.isValida = function () {
  const now = new Date();
  return (
    this.attiva &&
    now >= new Date(this.dataInizio) &&
    now <= new Date(this.dataFine)
  );
};

export default mongoose.model("Offerta", OffertaSchema);
