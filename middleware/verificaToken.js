// server/middleware/verificaToken.js

import jwt from "jsonwebtoken";
import Utente from "../models/Utente.js";
import Venditore from "../models/Venditore.js";

export const verificaToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token mancante" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const utente = await Utente.findById(decoded.id);

    if (!utente) {
      return res.status(401).json({ error: "Token non valido" });
    }

    // Attacca l'utente alla richiesta
    req.utente = {
      _id: utente._id,
      ruolo: utente.ruolo,
      email: utente.email,
      nome: utente.nome,
    };

    // Se l’utente è un venditore, recuperiamo anche il suo venditoreId
    if (utente.ruolo === "venditore") {
      const vend = await Venditore.findOne({ utente: utente._id });
      if (vend) req.utente.venditoreId = vend._id;
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};
