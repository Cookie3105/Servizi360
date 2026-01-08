// server/services/disponibilitaService.js
// Service per gestione disponibilità venditori

import Disponibilita from "../models/Disponibilita.js";
import Venditore from "../models/Venditore.js";

/**
 * 📌 CREA UNA DISPONIBILITÀ PER IL VENDITORE
 */
export const creaDisponibilitaService = async (venditoreId, data) => {
  if (!venditoreId) throw new Error("Venditore non autenticato.");

  const nuova = await Disponibilita.create({
    venditore: venditoreId,
    ...data,
  });

  // Aggiunge disponibilità al profilo venditore
  await Venditore.findByIdAndUpdate(venditoreId, {
    $push: { disponibilita: nuova._id },
  });

  return nuova;
};

/**
 * 📌 LISTA DISPONIBILITÀ DEL VENDITORE
 */
export const listaDisponibilitaVenditoreService = async (venditoreId) => {
  if (!venditoreId) throw new Error("Venditore non trovato.");

  return await Disponibilita.find({ venditore: venditoreId }).sort({
    giornoSettimana: 1,
  });
};

/**
 * 📌 AGGIORNA UNA DISPONIBILITÀ
 */
export const aggiornaDisponibilitaService = async (id, dati) => {
  const aggiornata = await Disponibilita.findByIdAndUpdate(id, dati, {
    new: true,
  });

  if (!aggiornata) throw new Error("Disponibilità non trovata.");

  return aggiornata;
};

/**
 * 📌 ELIMINA UNA DISPONIBILITÀ
 */
export const eliminaDisponibilitaService = async (id) => {
  const eliminata = await Disponibilita.findByIdAndDelete(id);

  if (!eliminata) throw new Error("Disponibilità non trovata.");

  // Rimuove riferimento dal venditore
  await Venditore.updateOne(
    { disponibilita: id },
    { $pull: { disponibilita: id } }
  );

  return true;
};
