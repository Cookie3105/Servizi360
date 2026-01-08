// server/controllers/serviziController.js
import Servizio from "../models/Servizio.js";
import Venditore from "../models/Venditore.js";

export const creaServizio = async (req, res) => {
  try {
    // MODIFICA: Troviamo il venditore usando l'ID utente (più sicuro)
    const venditore = await Venditore.findOne({ utente: req.user._id });

    if (!venditore) {
      return res.status(404).json({ success: false, message: "Profilo venditore non trovato. Assicurati di essere registrato come venditore." });
    }

    // Creiamo il servizio usando l'ID del venditore trovato
    const nuovoServizio = await Servizio.create({
      venditore: venditore._id,
      nome: req.body.nome, // Assicurati di prendere "nome"
      categoria: req.body.categoria,
      prezzo: req.body.prezzo,
      descrizione: req.body.descrizione,
      durata: req.body.durata,
      immagine: req.body.immagine
    });

    res.status(201).json({ success: true, data: nuovoServizio });
  } catch (error) {
    console.error("Errore creaServizio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ottieni SOLO i servizi del venditore loggato
// @route   GET /api/servizi/miei-servizi
export const getMieiServizi = async (req, res) => {
  try {
    const venditoreId = req.user.venditoreId;
    // Cerca i servizi dove il campo "venditore" corrisponde al mio ID
    const servizi = await Servizio.find({ venditore: venditoreId }).sort({ createdAt: -1 });
    res.json({ success: true, data: servizi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aggiorna un servizio esistente
// @route   PUT /api/servizi/:id
export const aggiornaServizio = async (req, res) => {
  try {
    const servizio = await Servizio.findById(req.params.id);

    if (!servizio) {
      return res.status(404).json({ success: false, message: "Servizio non trovato" });
    }

    // SICUREZZA: Controllo se il servizio appartiene davvero a chi sta provando a modificarlo
    if (servizio.venditore.toString() !== req.user.venditoreId.toString()) {
      return res.status(403).json({ success: false, message: "Non sei autorizzato a modificare questo servizio" });
    }

    // Aggiorna i campi
    const servizioAggiornato = await Servizio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: servizioAggiornato });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ottieni singolo servizio (per popolare il form di modifica)
export const getServizioById = async (req, res) => {
    try {
        const servizio = await Servizio.findById(req.params.id);
        if(!servizio) return res.status(404).json({message: "Non trovato"});
        res.json({ success: true, data: servizio });
    } catch (e) { res.status(500).json({message: e.message}); }
};

// @desc    Lista pubblica (per la home)
export const listaServizi = async (req, res) => {
    try {
        const servizi = await Servizio.find({ attivo: true });
        res.json({ success: true, data: servizi });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const eliminaServizio = async (req, res) => {};

export const cercaServizi = async (req, res) => {
  try {
    const { luogo = "", servizio = "" } = req.body;

    console.log("------------------------------------------");
    console.log(`🔎 RICERCA SMART: Luogo='${luogo}', Servizio='${servizio}'`);

    let filtroVenditori = {};

    // 1. LOGICA LUOGO: Filtriamo per venditore SOLO se l'utente ha scritto un luogo
    if (luogo.trim() !== "") {
      const venditoriTrovati = await Venditore.find({
        indirizzo: { $regex: luogo, $options: "i" }
      }).select("_id");
      
      const ids = venditoriTrovati.map(v => v._id);
      
      // Se cerco un luogo specifico ma non trovo venditori lì, inutile cercare servizi
      if (ids.length === 0) {
        console.log("❌ Nessun venditore trovato in questa zona.");
        return res.json([]); 
      }
      
      filtroVenditori = { venditore: { $in: ids } };
      console.log(`✅ Filtro per ${ids.length} venditori in zona.`);
    } else {
      console.log("🌍 Nessun luogo specificato: Cerco in tutta Italia.");
    }

    // 2. LOGICA SERVIZIO: Cerca in Nome, Titolo (vecchio db) o Categoria
    const queryServizi = {
      attivo: true,
      ...filtroVenditori, // Applica il filtro venditore (se esiste)
      $or: [
        { nome: { $regex: servizio, $options: "i" } },      // Nuovo standard
        { titolo: { $regex: servizio, $options: "i" } },    // Vecchio standard (visto nel tuo screenshot)
        { categoria: { $regex: servizio, $options: "i" } }  // Categoria
      ]
    };

    // 3. ESECUZIONE
    const risultati = await Servizio.find(queryServizi)
      .populate("venditore", "nomeAttivita indirizzo email telefono");

    console.log(`🚀 RISULTATI TROVATI: ${risultati.length}`);
    console.log("------------------------------------------");

    // 4. FORMATTAZIONE
    const rispostaFrontend = risultati.map(s => {
      const venditoreInfo = s.venditore || { nomeAttivita: "Utente Cancellato", indirizzo: "-" };
      
      return {
        id: s._id, // <--- AGGIUNGI QUESTA RIGA QUI! (Serve per il tasto prenota)
        nome: s.nome || s.titolo || "Servizio senza nome",
        prezzo: s.prezzo,
        immagine: s.immagine || "https://placehold.co/300",
        media: s.recensioneMediaGlobale || 0,
        totale: s.totaleRecensioniGlobali || 0,
        orari: "09:00 - 18:00",
        posizione: venditoreInfo.indirizzo || "-",
        ultima: "N/A",
        venditore: venditoreInfo.nomeAttivita
      };
    });

    res.json(rispostaFrontend);

  } catch (error) {
    console.error("🔥 ERRORE RICERCA:", error);
    res.status(500).json({ message: error.message });
  }
};