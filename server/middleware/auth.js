// server/middleware/auth.js
// Middleware per autenticazione JWT (versione migliorata basata sul tuo codice)

import jwt from "jsonwebtoken";

/**
 * Middleware che verifica la presenza e validità del token JWT.
 * 
 * Vantaggi rispetto alla versione precedente:
 * - migliore gestione dei messaggi di errore
 * - compatibile con ruoli (req.user.role)
 * - fallback su variabili mancanti in .env
 * - log coerenti
 * - robusto contro header malformati
 */
export const verificaToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // Header assente
    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Token non fornito. Autenticazione richiesta.",
      });
    }

    // Formato: Bearer <token>
    const parts = header.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Formato token non valido.",
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token mancante.",
      });
    }

    // Verifica token con segreto .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    // Aggiungo i dati dell'utente alla richiesta
    req.user = {
      id: decoded.id,
      email: decoded.email,
      ruolo: decoded.ruolo || "user", // default per retrocompatibilità
    };

    // Passa al controller successivo
    next();

  } catch (error) {
    console.error("🔐 Errore autenticazione JWT:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token non valido o scaduto.",
    });
  }
};
