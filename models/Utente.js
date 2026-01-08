// server/models/Utente.js
// Modello Mongoose

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UtenteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Il nome è obbligatorio."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "L'email è obbligatoria."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "La password è obbligatoria."],
      minlength: [4, "La password deve contenere almeno 4 caratteri."],
    },

    ruolo: {
      type: String,
      enum: ["user", "venditore", "admin"],
      default: "user",
    },

    telefono: {
      type: String,
      default: "",
    },

    fotoProfilo: {
      type: String,
      default: "",
    },

    preferenze: {
      lingua: {
        type: String,
        default: "IT",
      },
      notificheEmail: {
        type: Boolean,
        default: true,
      },
      notifichePush: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash automatico della password
 */
UtenteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Confronto password per login
 */
UtenteSchema.methods.verificaPassword = async function (passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

/**
 * Rimozione campi sensibili dall’output
 */
UtenteSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.model("Utente", UtenteSchema);
