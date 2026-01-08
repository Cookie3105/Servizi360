// server/middleware/errorHandler.js
// Gestione centralizzata degli errori e delle route non trovate

/**
 * Middleware 404 - Route non trovata
 * Viene eseguito solo se nessuna rotta precedente ha risposto.
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `La risorsa richiesta (${req.originalUrl}) non è stata trovata.`,
  });
};


/**
 * Middleware principale per gestione errori
 * Intercetta qualsiasi errore proveniente da:
 * - controller
 * - servizi
 * - Mongoose
 * - middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Errore intercettato dal middleware globale:");
  console.error(err);

  // Status code passato manualmente → oppure fallback 500
  const statusCode = err.statusCode || 500;

  // Gestione errori Mongoose comuni
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Errore di validazione dati.",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID non valido o malformato.",
    });
  }

  // Errore generico standard
  res.status(statusCode).json({
    success: false,
    message: err.message || "Errore interno del server.",
  });
};
