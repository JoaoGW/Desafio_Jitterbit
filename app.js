const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");

app.use("/order", orderRoutes);

mongoose.connect("mongodb://localhost:27017/orders");

module.exports = app;
