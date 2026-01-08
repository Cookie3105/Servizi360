// server/services/searchService.js
// Ricerca avanzata + output compatibile con frontend (popup + results.html)

import Servizio from "../models/Servizio.js";
import Venditore from "../models/Venditore.js";
import PrestazioneVenditore from "../models/PrestazioneVenditore.js";
import Disponibilita from "../models/Disponibilita.js";
import Recensione from "../models/Recensione.js";

/**
 * Parametri:
 * - luogo (string, obbligatorio)
 * - servizio (string, obbligatorio)
 * - prezzoMin / prezzoMax (number, opzionali)
 * - valutMin (number, opzionale)
 * - disponibilita (string: "", "oggi", "domani", "settimana")
 * - sortBy (string: "", "prezzo_asc", "prezzo_desc", "valutazione_desc")
 */
export async function ricercaServiziService({
  luogo,
  servizio,
  prezzoMin,
  prezzoMax,
  valutMin,
  disponibilita,
  sortBy,
}) {
  const regexLuogo = new RegExp(luogo, "i");
  const regexServizio = new RegExp(servizio, "i");

  try {
    // 1) CERCO I SERVIZI CORRISPONDENTI
    const serviziTrovati = await Servizio.find({
      $or: [
        { nome: regexServizio },
        { categoria: regexServizio },
        { descrizione: regexServizio },
        { tags: { $in: [servizio.toLowerCase()] } },
      ],
    }).populate({
      path: "venditori",
      populate: { path: "prestazioni", model: "PrestazioneVenditore" },
    });

    let venditoriCandidati = [];

    // 2) FILTRO VENDITORI PER CITTÀ E PREZZO
    for (const servizioItem of serviziTrovati) {
      const venditoriValidi = servizioItem.venditori.filter((v) => {
        let ok = true;

        // Città (indirizzo.citta o citta diretta)
        const cittaVend =
          v.indirizzo?.citta || v.citta || v.città || v.cittàOperativa;
        if (cittaVend && !regexLuogo.test(cittaVend)) ok = false;

        // Prezzo medio
        if (ok && (prezzoMin !== undefined || prezzoMax !== undefined)) {
          const p = v.prezzoMedio || 0;
          if (prezzoMin !== undefined && p < prezzoMin) ok = false;
          if (prezzoMax !== undefined && p > prezzoMax) ok = false;
        }

        // Valutazione minima
        if (ok && valutMin !== undefined) {
          const media = v.mediaValutazioni || 0;
          if (media < valutMin) ok = false;
        }

        return ok;
      });

      venditoriCandidati.push(...venditoriValidi);
    }

    // 3) SE NON TROVO NIENTE NEI SERVIZI → CERCO DIRETTAMENTE NEI VENDITORI
    if (venditoriCandidati.length === 0) {
      venditoriCandidati = await Venditore.find({
        $and: [
          {
            $or: [
              { citta: regexLuogo },
              { "indirizzo.citta": regexLuogo },
            ],
          },
          {
            $or: [
              { categoria: regexServizio },
              { nomeAttivita: regexServizio },
              { descrizione: regexServizio },
            ],
          },
        ],
      });
    }

    // 4) ARRICCHIMENTO CON RECENSIONI + DISPONIBILITÀ
    const risultatiEstesi = [];

    for (const v of venditoriCandidati) {
      const ultimaRecensione = await Recensione.findOne({
        venditore: v._id,
      })
        .sort({ dataRecensione: -1 })
        .limit(1);

      const disponibilitaAttiva = await Disponibilita.find({
        venditore: v._id,
        attivo: true,
      });

      // Filtro disponibilità lato backend
      if (disponibilita && disponibilita !== "") {
        const oggi = new Date();
        let ok = false;

        if (disponibilita === "oggi") {
          ok = disponibilitaAttiva.some((d) => stessaData(d.data, oggi));
        } else if (disponibilita === "domani") {
          const domani = new Date();
          domani.setDate(domani.getDate() + 1);
          ok = disponibilitaAttiva.some((d) => stessaData(d.data, domani));
        } else if (disponibilita === "settimana") {
          const fra7 = new Date();
          fra7.setDate(fra7.getDate() + 7);
          ok = disponibilitaAttiva.some((d) => {
            const data = new Date(d.data);
            return data >= oggi && data <= fra7;
          });
        }

        if (!ok) continue;
      }

      // costruzione stringa orari
      const orariStr =
        disponibilitaAttiva && disponibilitaAttiva.length > 0
          ? disponibilitaAttiva
              .map((d) => `${formatData(d.data)} ${d.orarioInizio}-${d.orarioFine}`)
              .join(" | ")
          : "Da concordare";

      risultatiEstesi.push({
        rawVenditore: v,
        prezzo: v.prezzoMedio || 0,
        media: v.mediaValutazioni || 0,
        orariStr,
        ultimaRecensione,
        totaleRecensioni: v.numeroRecensioni || 0,
      });
    }

    // 5) ORDINAMENTO BACKEND
    if (sortBy === "prezzo_asc") {
      risultatiEstesi.sort((a, b) => a.prezzo - b.prezzo);
    } else if (sortBy === "prezzo_desc") {
      risultatiEstesi.sort((a, b) => b.prezzo - a.prezzo);
    } else if (sortBy === "valutazione_desc") {
      risultatiEstesi.sort((a, b) => b.media - a.media);
    }

    // 6) MAPPING NEL FORMATO FRONTEND
    const risultatiFinali = risultatiEstesi.map((item, index) => {
      const v = item.rawVenditore;
      return {
        id: v._id?.toString() || index + 1,
        immagine:
          v.immagine ||
          "https://placehold.co/160x120/2563EB/FFFFFF?text=Servizio",
        nome: v.nomeAttivita || v.nome || "Professionista",
        prezzo: item.prezzo,
        media: Number(item.media.toFixed(1)),
        orari: item.orariStr,
        ultima:
          item.ultimaRecensione?.testo ||
          "Nessuna recensione disponibile.",
        totale: item.totaleRecensioni,
        posizione: index + 1,
        categoria: v.categoria || "",
      };
    });

    // 7) SE ANCORA NON C'È NULLA → MOCK DI EMERGENZA
    if (risultatiFinali.length === 0) {
      return [
        {
          id: "mock-1",
          immagine: "https://placehold.co/160x120/0F172A/FFFFFF?text=Servizio",
          nome: `${servizio} a ${luogo}`,
          prezzo: 50,
          media: 8.7,
          orari: "Lun–Ven 09:00–18:00",
          ultima: "Servizio rapido e professionale.",
          totale: 12,
          posizione: 1,
          categoria: servizio,
        },
      ];
    }

    return risultatiFinali;
  } catch (err) {
    console.error("❌ Errore ricerca avanzata:", err);
    return [
      {
        id: "errore",
        immagine: "https://placehold.co/160x120/EF4444/FFFFFF?text=Errore",
        nome: "Errore durante la ricerca",
        prezzo: 0,
        media: 0,
        orari: "-",
        ultima: "Impossibile recuperare i dati.",
        totale: 0,
        posizione: 1,
        categoria: "",
      },
    ];
  }
}

function stessaData(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatData(d) {
  const date = new Date(d);
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });
}
