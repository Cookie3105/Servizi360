import Promozione from "../models/Promozione.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";

export async function getHomePromozioniService() {
  try {
    const promo = await Promozione.find().limit(10);

    if (promo && promo.length > 0) {
      return promo.map((p) => ({
        img:
          p.immagine ||
          "https://placehold.co/280x180/F97316/FFFFFF?text=Promo",
        nome: p.titolo || "Promozione speciale",
        prezzo: p.prezzoScontato || p.prezzo || 0,
      }));
    }
  } catch (err) {
    console.error("Errore lettura promozioni da DB:", err);
  }

  // Fallback statico
  return [
    {
      img: "https://placehold.co/280x180/0EA5E9/FFFFFF?text=Promo+Casa",
      nome: "Sconto 20% pulizie casa",
      prezzo: 39,
    },
    {
      img: "https://placehold.co/280x180/22C55E/FFFFFF?text=Promo+Eventi",
      nome: "Pacchetto fotografo eventi",
      prezzo: 149,
    },
  ];
}

export async function getHomeConsigliatiService() {
  try {
    const prestazioni = await PrestazioneVenditore.find().limit(10);

    if (prestazioni && prestazioni.length > 0) {
      return prestazioni.map((p) => ({
        img:
          p.immagine ||
          "https://placehold.co/280x180/6366F1/FFFFFF?text=Servizio",
        nome: p.nome || p.titolo || "Servizio consigliato",
        prezzo: p.prezzoMedio || p.prezzo || 0,
      }));
    }
  } catch (err) {
    console.error("Errore lettura consigliati da DB:", err);
  }

  // Fallback statico
  return [
    {
      img: "https://placehold.co/280x180/4F46E5/FFFFFF?text=Idraulico",
      nome: "Idraulico urgente 24/7",
      prezzo: 59,
    },
    {
      img: "https://placehold.co/280x180/EC4899/FFFFFF?text=Fotografo",
      nome: "Fotografo per eventi",
      prezzo: 199,
    },
  ];
}
