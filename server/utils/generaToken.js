// server/utils/generaToken.js

import jwt from "jsonwebtoken";

export const generaToken = (utente) => {
  return jwt.sign(
    {
      id: utente._id,
      ruolo: utente.ruolo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
