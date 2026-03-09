const Order = require("../models/Order");

/**
 * Converte os itens recebidos no payload para o formato persistido no banco.
 * @param {Array<{idItem: string|number, quantidadeItem: string|number, valorItem: string|number}>} items
 * @returns {Array<{productId: number, quantity: number, price: number}>}
 */
function mapItems(items) {
  return items.map((item) => ({
    productId: Number(item.idItem),
    quantity: Number(item.quantidadeItem),
    price: Number(item.valorItem),
  }));
}

/**
 * Cria um novo pedido a partir dos dados enviados no corpo da requisicao.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body || {};

    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        message:
          "Campos obrigatorios: numeroPedido, valorTotal, dataCriacao e items.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "'items' deve ser um array com itens." });
    }

    const mapped = {
      orderId: String(numeroPedido),
      value: Number(valorTotal),
      creationDate: new Date(dataCriacao),
      items: mapItems(items),
    };

    const order = await Order.create(mapped);
    return res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ja existe um pedido com este numero.",
      });
    }
    return res
      .status(500)
      .json({ message: "Erro ao criar pedido", error: error.message });
  }
};

/**
 * Busca um pedido pelo identificador informado na rota.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
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

/**
 * Lista todos os pedidos cadastrados.
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
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

/**
 * Atualiza campos permitidos de um pedido existente.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
exports.updateOrder = async (req, res) => {
  try {
    const body = req.body || {};
    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: "Envie um JSON com dados para atualizar." });
    }

    const updateData = {};

    if (body.valorTotal !== undefined) {
      updateData.value = Number(body.valorTotal);
    }

    if (body.dataCriacao !== undefined) {
      updateData.creationDate = new Date(body.dataCriacao);
    }

    if (body.items !== undefined) {
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return res
          .status(400)
          .json({ message: "'items' deve ser um array com itens." });
      }
      updateData.items = mapItems(body.items);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message:
          "Nenhum campo valido para atualizar. Use valorTotal, dataCriacao ou items.",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      updateData,
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
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ja existe um pedido com este numero.",
      });
    }
    return res
      .status(500)
      .json({ message: "Erro ao atualizar pedido", error: error.message });
  }
};

/**
 * Remove um pedido pelo identificador da rota.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response|void>}
 */
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      orderId: req.params.id,
    });
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
