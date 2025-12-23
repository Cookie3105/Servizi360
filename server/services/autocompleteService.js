import Venditore from "../models/Venditore.js";
import Servizio from "../models/Servizio.js";

export async function autocompleteCittaService() {
  // Prova a prendere le città dai venditori
  try {
    const cittaDB = await Venditore.distinct("citta");
    const pulite = cittaDB
      .filter(Boolean)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (pulite.length > 0) {
      return pulite.sort((a, b) => a.localeCompare(b, "it"));
    }
  } catch (err) {
    console.error("Errore lettura città da DB:", err);
  }

  // Fallback statico se DB vuoto / schema diverso
  return [
    "Roma",
    "Milano",
    "Napoli",
    "Torino",
    "Bologna",
    "Firenze",
    "Palermo",
    "Genova",
  ];
}

export async function autocompleteServiziService() {
  try {
    const serviziDB = await Servizio.distinct("nome");
    const puliti = serviziDB
      .filter(Boolean)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (puliti.length > 0) {
      return puliti.sort((a, b) => a.localeCompare(b, "it"));
    }
  } catch (err) {
    console.error("Errore lettura servizi da DB:", err);
  }

  // Fallback statico
  return [
    "Idraulico",
    "Elettricista",
    "Fotografo",
    "Baby sitter",
    "Pulizie casa",
    "Giardiniere",
    "Personal trainer",
    "Dog sitter",
  ];
}
