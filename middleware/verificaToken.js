// server/middleware/verificaToken.js
import jwt from "jsonwebtoken";
import Utente from "../models/Utente.js";

export const verificaToken = async (req, res, next) => {
  let token;

  // 1. Controlla se c'è l'header "Authorization" che inizia con "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Prendi solo il token (togli la parola "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // 3. Decifra il token
      // IMPORTANTE: La chiave di riserva DEVE essere identica a quella nel controller (segreto_super)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "segreto_super");

      // 4. Trova l'utente nel database (escludendo la password)
      // Mettiamo l'utente dentro req.user così le altre funzioni possono usarlo
      req.user = await Utente.findById(decoded.id).select("-password");

      // 5. Se l'utente è stato cancellato nel frattempo
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Utente non trovato nel database" });
      }

      // Se nel token c'era il ruolo, lo aggiungiamo a mano per sicurezza
      if(decoded.role) {
          req.user.role = decoded.role;
      }

      next(); // Passa alla prossima funzione
    } catch (error) {
      console.error("Errore token:", error.message);
      res.status(401).json({ success: false, message: "Token non valido o scaduto" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Nessun token fornito, accesso negato" });
  }
};