// server/controllers/prenotazioniController.js
import Prenotazione from "../models/Prenotazione.js";
import Servizio from "../models/Servizio.js";
import Venditore from "../models/Venditore.js";

// @desc    Crea una nuova prenotazione
// @route   POST /api/prenotazioni
export const creaPrenotazione = async (req, res) => {
  try {
    // 1. Riceviamo i dati dal frontend
    // dataRichiesta arriva come "2024-05-10 ore 15:00"
    const { servizioId, dataRichiesta } = req.body;

    // 2. Controllo dati base
    if (!servizioId || !dataRichiesta) {
      return res.status(400).json({ message: "Dati mancanti (Servizio o Data)" });
    }

    // 3. Separiamo Data e Ora
    // La stringa è "YYYY-MM-DD ore HH:MM"
    const parti = dataRichiesta.split(" ore ");
    if (parti.length !== 2) {
      return res.status(400).json({ message: "Formato data non valido" });
    }
    const dataPart = parti[0]; // "2024-05-10"
    const oraPart = parti[1];  // "15:00"

    // 4. Troviamo il Servizio per prendere info (prezzo, venditore)
    const servizio = await Servizio.findById(servizioId);
    if (!servizio) {
      return res.status(404).json({ message: "Servizio non trovato nel database" });
    }

    // 5. Creiamo la prenotazione
    // Nota: req.user._id arriva dal middleware verificaToken
    const nuovaPrenotazione = await Prenotazione.create({
      cliente: req.user._id,        
      venditore: servizio.venditore, 
      servizio: servizio._id,
      nomeServizio: servizio.nome,
      prezzo: servizio.prezzo,
      data: dataPart,
      ora: oraPart,
      stato: "in_attesa"
    });

    res.status(201).json({ 
      success: true, 
      message: "Prenotazione salvata!", 
      data: nuovaPrenotazione 
    });

  } catch (error) {
    console.error("Errore salvataggio prenotazione:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lista prenotazioni per il VENDITORE
// @route   GET /api/prenotazioni/venditore
export const listaPrenotazioniVenditore = async (req, res) => {
  try {
    // Trova il venditore associato all'utente loggato
    const venditore = await Venditore.findOne({ utente: req.user._id });
    if (!venditore) return res.status(404).json({ message: "Venditore non trovato" });

    const prenotazioni = await Prenotazione.find({ venditore: venditore._id })
      .populate("cliente", "nome email") // Mostra chi ha prenotato
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prenotazioni });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aggiorna stato (Accetta/Rifiuta)
// @route   PUT /api/prenotazioni/:id
export const aggiornaStatoPrenotazione = async (req, res) => {
  try {
    const { stato } = req.body;
    const prenotazione = await Prenotazione.findByIdAndUpdate(
      req.params.id,
      { stato },
      { new: true }
    );
    res.json({ success: true, data: prenotazione });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Placeholder per evitare errori di import nelle rotte
export const listaPrenotazioniUtente = async (req, res) => { res.json({success:true, data:[]}) };
export const getPrenotazioneById = async (req, res) => { res.json({success:true}) };