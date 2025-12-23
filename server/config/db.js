// server/config/db.js
// Connessione centralizzata a MongoDB tramite Mongoose

import mongoose from "mongoose";

// Messaggi per capire quando si tenta la connessione
console.log("⏳ Connessione al database MongoDB in corso...");

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB connesso con successo`);
    console.log(`📡 Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Errore di connessione a MongoDB:");
    console.error(error.message);

    // Retry automatico dopo 5 secondi
    setTimeout(connectDB, 5000);
  }
};
