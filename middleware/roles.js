// server/middleware/roles.js
// Middleware per autorizzazione basata sui ruoli (user, venditore, admin)

export const verificaRuolo = (...ruoliPermessi) => {
  return (req, res, next) => {
    try {
      // Se req.user non esiste → non è autenticato
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Autenticazione richiesta.",
        });
      }

      const ruoloUtente = req.user.ruolo || "user";

      // Controlla se il ruolo dell’utente è tra quelli ammessi
      if (!ruoliPermessi.includes(ruoloUtente)) {
        return res.status(403).json({
          success: false,
          message: "Accesso negato. Permessi insufficienti.",
          richiesto: ruoliPermessi,
          trovato: ruoloUtente,
        });
      }

      // Utente autorizzato
      next();

    } catch (err) {
      console.error("🔐 Errore verifica ruolo:", err.message);

      return res.status(500).json({
        success: false,
        message: "Errore interno nella verifica dei permessi.",
      });
    }
  };
};
