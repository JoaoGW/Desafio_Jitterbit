// (Documentação automaticamente gerada pelo Copilot)
const mongoose = require("mongoose");

// Schema de cada item que vai dentro do pedido
const ItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

// Schema do pedido ja com os campos mapeados para o banco.
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  value: { type: Number, required: true, min: 0 },
  creationDate: { type: Date, required: true },
  items: {
    type: [ItemSchema],
    required: true,
    validate: [(v) => v.length > 0, "items nao pode ser vazio"], // Garante que o array de itens nao venha vazio
  },
});

module.exports = mongoose.model("Order", OrderSchema);
