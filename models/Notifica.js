import mongoose from 'mongoose';

const notificaSchema = new mongoose.Schema({
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente', // Collega la notifica all'utente
    required: true
  },
  tipo: {
    type: String,
    enum: ['sistema', 'prenotazione', 'promozione'], // Tipi di notifica
    default: 'sistema'
  },
  messaggio: {
    type: String,
    required: true
  },
  letta: {
    type: Boolean,
    default: false
  },
  dataCreazione: {
    type: Date,
    default: Date.now
  }
});

const Notifica = mongoose.model('Notifica', notificaSchema);

export default Notifica;