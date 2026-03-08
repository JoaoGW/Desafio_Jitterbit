const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const data = req.body;

  const mapped = {
    orderId: data.numeroPedido,
    value: data.valorTotal,
    creationDate: data.dataCriacao,
    items: data.items.map((i) => ({
      productId: Number(i.idItem),
      quantity: i.quantidadeItem,
      price: i.valorItem,
    })),
  };

  const order = await Order.create(mapped);

  res.status(201).json(order);
};
