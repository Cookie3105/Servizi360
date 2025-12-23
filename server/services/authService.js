// server/services/authService.js
// Logica di autenticazione astratta usata da authController

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Utente from "../models/Utente.js";

/**
 * Genera un token JWT firmato
 */
export const generaToken = (utente) => {
  return jwt.sign(
    {
      id: utente._id,
      email: utente.email,
      ruolo: utente.ruolo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

/**
 * Verifica credenziali durante il login
 */
export const verificaCredenziali = async (email, password) => {
  const utente = await Utente.findOne({ email });

  if (!utente) return null;

  const passwordCorretta = await bcrypt.compare(password, utente.password);

  if (!passwordCorretta) return null;

  return utente;
};

/**
 * Crea un nuovo utente
 */
export const registraUtente = async ({ nome, email, password, ruolo }) => {
  const esiste = await Utente.findOne({ email });

  if (esiste) {
    throw new Error("Email già registrata.");
  }

  const nuovoUtente = await Utente.create({
    nome,
    email,
    password,
    ruolo: ruolo || "user",
  });

  return nuovoUtente;
};

/**
 * Ottiene un utente dal DB tramite id
 */
export const getUtenteById = async (id) => {
  return await Utente.findById(id).select("-password");
};
