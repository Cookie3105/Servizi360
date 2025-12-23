import {
  autocompleteCittaService,
  autocompleteServiziService,
} from "../services/autocompleteService.js";

export async function getCittaAutocomplete(req, res) {
  try {
    const citta = await autocompleteCittaService();
    res.json(citta);
  } catch (err) {
    console.error("Errore autocomplete citta:", err);
    res.status(500).json({ success: false, message: "Errore server autocomplete città" });
  }
}

export async function getServiziAutocomplete(req, res) {
  try {
    const servizi = await autocompleteServiziService();
    res.json(servizi);
  } catch (err) {
    console.error("Errore autocomplete servizi:", err);
    res.status(500).json({ success: false, message: "Errore server autocomplete servizi" });
  }
}
