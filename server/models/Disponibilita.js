// server/models/Disponibilita.js
// Modello Mongoose
// Gestisce i giorni e gli orari in cui un venditore è disponibile

import mongoose from "mongoose";

const DisponibilitaSchema = new mongoose.Schema(
  {
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Giorno della settimana (0 = Domenica, 1 = Lunedì, ... 6 = Sabato)
    giornoSettimana: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    // Orario di inizio disponibilità
    oraInizio: {
      type: String,
      required: true,
    },

    // Orario fine disponibilità
    oraFine: {
      type: String,
      required: true,
    },

    // Slot occupati (prenotazioni confermate)
    slotOccupati: [
      {
        data: { type: Date, required: true },
        ora: { type: String, required: true },
        prenotazione: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prenotazione",
        },
      },
    ],

    // Disponibilità attiva o disattivata dal venditore
    attivo: {
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
DisponibilitaSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Disponibilita", DisponibilitaSchema);
