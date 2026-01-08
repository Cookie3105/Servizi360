import {
  getHomePromozioniService,
  getHomeConsigliatiService,
} from "../services/homeService.js";

export async function getHomePromozioni(req, res) {
  try {
    const items = await getHomePromozioniService();
    res.json(items);
  } catch (err) {
    console.error("Errore home promozioni:", err);
    res.status(500).json({
      success: false,
      message: "Errore server caricamento promozioni",
    });
  }
}

export async function getHomeConsigliati(req, res) {
  try {
    const items = await getHomeConsigliatiService();
    res.json(items);
  } catch (err) {
    console.error("Errore home consigliati:", err);
    res.status(500).json({
      success: false,
      message: "Errore server caricamento consigliati",
    });
  }
}
