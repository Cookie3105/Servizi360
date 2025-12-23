// server/middleware/verificaRuolo.js

export const verificaRuolo = (ruoloRichiesto) => {
  return (req, res, next) => {
    if (!req.utente) {
      return res.status(401).json({ error: "Non autorizzato" });
    }

    if (req.utente.ruolo !== ruoloRichiesto) {
      return res.status(403).json({
        error: `Accesso negato: ruolo richiesto = ${ruoloRichiesto}`,
      });
    }

    next();
  };
};
