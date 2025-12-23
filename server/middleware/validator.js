// server/middleware/validator.js
// Middleware per validazione input tramite Joi (ES Modules)

import Joi from "joi";

/**
 * Middleware che valida req.body, req.params o req.query
 * in base allo schema Joi passato.
 *
 * USO:
 * router.post("/login", validate(bodySchema), controller.login)
 *
 * bodySchema = Joi.object({ email: Joi.string().email().required() })
 */

export const validate = (schema, type = "body") => {
  return (req, res, next) => {
    try {
      const data = req[type];

      // Valida i dati
      const { error, value } = schema.validate(data, {
        abortEarly: false,       // mostra tutti gli errori, non solo il primo
        stripUnknown: true,      // rimuove campi non richiesti
      });

      // Se ci sono errori → restituire risposta standard
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Dati non validi.",
          errors: error.details.map((d) => d.message),
        });
      }

      // Dati validi → sostituisco i valori puliti
      req[type] = value;

      next();
    } catch (err) {
      console.error("❌ Errore validator:", err);

      return res.status(500).json({
        success: false,
        message: "Errore interno nella validazione.",
      });
    }
  };
};
