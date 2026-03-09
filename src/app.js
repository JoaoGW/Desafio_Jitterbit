// (Documentação automaticamente gerada pelo Copilot)
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const orderRoutes = require("./routes/orderRoute");
const authRoutes = require("./routes/authRoute");

app.use("/order", orderRoutes);
app.use("/auth", authRoutes);

// Funcao simples para conectar no MongoDB.
async function connectDB() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/orders";
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = { app, connectDB };
