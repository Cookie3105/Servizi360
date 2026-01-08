// server/models/Servizio.js
import mongoose from "mongoose";

const ServizioSchema = new mongoose.Schema(
  {
    // CORREZIONE: Deve essere "venditore" (singolare) per funzionare con il controller
    venditore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venditore",
      required: true,
    },

    // Usa "nome" (questo è corretto, lo lasciamo così)
    nome: {
      type: String,
      required: [true, "Il nome del servizio è obbligatorio."],
      trim: true,
    },

    categoria: { type: String, required: true },
    
    prezzo: { type: Number, required: true },
    
    durata: { type: String, default: "" },
    
    descrizione: { type: String, default: "" },
    
    immagine: { type: String, default: "" },
    
    attivo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Servizio", ServizioSchema);