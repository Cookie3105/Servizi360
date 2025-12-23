// server/models/Promozione.js
// Modello Mongoose
// Gestisce promozioni globali della piattaforma (homepage, banner, campagne)

import mongoose from "mongoose";

const PromozioneSchema = new mongoose.Schema(
  {
    // Titolo della promozione
    titolo: {
      type: String,
      required: [true, "Il titolo della promozione è obbligatorio."],
      trim: true,
    },

    // Descrizione dell’iniziativa
    descrizione: {
      type: String,
      default: "",
    },

    // Immagine o banner promozionale
    immagine: {
      type: String,
      default: "",
    },

    // Percentuale di sconto (se applicabile)
    percentualeSconto: {
      type: Number,
      default: null,
    },

    // Timestamp inizio validità
    dataInizio: {
      type: Date,
      required: true,
    },

    // Timestamp fine validità
    dataFine: {
      type: Date,
      required: true,
    },

    // Tags utili per categorie (es: "Estate", "Natale")
    tags: {
      type: [String],
      default: [],
    },

    // Stato della promozione
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
 * Pulizia output JSON (rimuove campi inutili)
 */
PromozioneSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/**
 * Controlla se la promozione è attualmente valida
 */
PromozioneSchema.methods.isValida = function () {
  const now = new Date();
  return (
    this.attiva &&
    now >= new Date(this.dataInizio) &&
    now <= new Date(this.dataFine)
  );
};

export default mongoose.model("Promozione", PromozioneSchema);
