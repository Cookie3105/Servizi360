// server/models/Prenotazione.js
// Modello Mongoose
// Gestisce prenotazioni, stato, pagamento e collegamenti

import mongoose from "mongoose";

const PrenotazioneSchema = new mongoose.Schema(
  {
    // Utente che effettua la prenotazione
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
      required: true,
    },

    // Venditore coinvolto nella prenotazione
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Prestazione scelta dall’utente (legata al venditore)
    prestazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrestazioneVenditore",
      required: true,
    },

    // Data dell’appuntamento
    data: {
      type: Date,
      required: true,
    },

    // Orario dell’appuntamento (stringa es: "14:30")
    ora: {
      type: String,
      required: true,
    },

    // Prezzo totale al momento della prenotazione
    prezzoTotale: {
      type: Number,
      required: true,
    },

    // Note aggiuntive scritte dall’utente
    note: {
      type: String,
      default: "",
    },

    // Stato prenotazione
    stato: {
      type: String,
      enum: ["in_attesa", "confermata", "rifiutata", "completata", "annullata"],
      default: "in_attesa",
    },

    // Dati pagamento (Stripe)
    pagamento: {
      metodo: { type: String, default: null }, // es: "stripe"
      transazioneId: { type: String, default: null },
      pagato: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Pulizia output
PrenotazioneSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Prenotazione", PrenotazioneSchema);
