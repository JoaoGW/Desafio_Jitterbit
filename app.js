const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

const orderRoutes = require("./routes/orderRoute");

app.use("/order", orderRoutes);

const mongoUri = "mongodb://127.0.0.1:27017/orders";

async function connectDB() {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}

module.exports = { app, connectDB };
