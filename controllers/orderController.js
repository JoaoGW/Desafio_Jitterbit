const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    const mapped = {
      orderId: data.numeroPedido,
      value: Number(data.valorTotal),
      creationDate: data.dataCriacao,
      items: Array.isArray(data.items)
        ? data.items.map((i) => ({
            productId: Number(i.idItem),
            quantity: Number(i.quantidadeItem),
            price: Number(i.valorItem),
          }))
        : [],
    };

    const order = await Order.create(mapped);
    return res.status(201).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao criar pedido", error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar pedido", error: error.message });
  }
};

exports.listOrders = async (_req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao listar pedidos", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao atualizar pedido", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao remover pedido", error: error.message });
  }
};
