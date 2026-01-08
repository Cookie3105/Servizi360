// server/controllers/venditoriController.js
import Venditore from "../models/Venditore.js";
import Utente from "../models/Utente.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "segreto_super", {
    expiresIn: "30d",
  });
};

// @desc    Registrazione Venditore
// @route   POST /api/venditori/register
export const registerVenditore = async (req, res) => {
  let nuovoUtente = null;

  try {
    const { nome, email, telefono, indirizzo, categoria, descrizione, password } = req.body;

    // 1. Controllo email esistente
    const utenteEsistente = await Utente.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({ success: false, message: "Email già registrata. Usa un'altra email." });
    }

    // 2. Creazione Utente (PASSA LA PASSWORD IN CHIARO)
    // Lasciamo che sia il modello Utente.js a criptarla prima di salvare
    nuovoUtente = await Utente.create({
      nome: nome,
      email: email,
      password: password, // <--- MODIFICA FONDAMENTALE: Niente bcrypt qui!
      ruolo: "venditore"
    });

    // 3. Creazione Profilo Venditore
    const nuovoVenditore = await Venditore.create({
      utente: nuovoUtente._id,
      nomeAttivita: nome,
      emailContatto: email,
      telefono: telefono || "",
      categoria: categoria || "Generico",
      descrizione: descrizione || "",
      indirizzo: { via: indirizzo || "" }
    });

    res.status(201).json({
      success: true,
      token: generateToken(nuovoUtente._id, "venditore"),
      user: {
        _id: nuovoUtente._id,
        nome: nuovoUtente.nome,
        email: nuovoUtente.email,
        ruolo: "venditore",
        venditoreId: nuovoVenditore._id
      }
    });

  } catch (err) {
    console.error("Errore registrazione:", err);
    // Rollback: se fallisce, cancella l'utente per non lasciare dati sporchi
    if (nuovoUtente) {
        await Utente.findByIdAndDelete(nuovoUtente._id);
    }
    res.status(500).json({ success: false, message: "Errore server: " + err.message });
  }
};

// @desc    Login Venditore
// @route   POST /api/venditori/login
export const loginVenditore = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cerca Utente
    const utente = await Utente.findOne({ email });
    if (!utente) {
        return res.status(401).json({ success: false, message: "Email non trovata" });
    }

    // 2. Verifica Password (bcrypt.compare gestisce il confronto col DB)
    const passwordMatch = await bcrypt.compare(password, utente.password);
    if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Password errata" });
    }

    // 3. Cerca Venditore
    const venditore = await Venditore.findOne({ utente: utente._id });
    if (!venditore) {
         return res.status(401).json({ success: false, message: "Account non attivo come venditore" });
    }

    res.json({
        success: true,
        token: generateToken(utente._id, "venditore"),
        user: {
            _id: utente._id,
            nome: utente.nome,
            email: utente.email,
            ruolo: "venditore",
            venditoreId: venditore._id
        }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Errore login" });
  }
};

// Funzioni placeholder
export const listaVenditori = async (req, res) => { res.json({success:true, data:[]}) };
export const venditoreById = async (req, res) => { res.json({success:true, data:{}}) };
export const creaVenditore = (req, res) => {};
export const getVenditoreLogged = async (req, res) => {
  try {
    // req.user viene popolato dal middleware verificaToken
    const venditoreId = req.user.venditoreId || req.user._id; // Fallback di sicurezza

    const venditore = await getVenditoreLoggedService(venditoreId);
    return successResponse(res, venditore);
  } catch (err) {
    console.error("Errore getVenditoreLogged:", err);
    return errorResponse(res, 404, "Profilo venditore non trovato");
  }
};
export const aggiornaVenditore = (req, res) => {};