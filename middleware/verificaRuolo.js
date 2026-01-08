// server/middleware/verificaRuolo.js

export const verificaRuolo = (ruoloRichiesto) => {
  return (req, res, next) => {
    // 1. Sicurezza: se verificaToken ha fallito, req.user non esiste
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Utente non loggato" });
    }

    // 2. Cerchiamo il ruolo ovunque (nel token decifrato o nel database)
    // Questo gestisce sia "role" (inglese) che "ruolo" (italiano)
    const ruoloUtente = req.user.role || req.user.ruolo || "user";

    console.log(`👮 Controllo Ruolo: Utente è [${ruoloUtente}], serve [${ruoloRichiesto}]`);

    // 3. Verifica (Admin passa sempre)
    if (ruoloUtente === ruoloRichiesto || ruoloUtente === "admin") {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: `Accesso negato. Serve il ruolo: ${ruoloRichiesto}` 
      });
    }
  };
};