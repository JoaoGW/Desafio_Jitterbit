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
    // Pega os campos que precisamos do body
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body || {};

    // Valida se os campos obrigatorios vieram no payload
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        message:
          "Campos obrigatorios: numeroPedido, valorTotal, dataCriacao e items.",
      });
    }

    // Garante que items seja um array com pelo menos 1 item
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "'items' deve ser um array com itens." });
    }

    // Mapeia os nomes do payload para os campos usados no banco
    const mapped = {
      orderId: String(numeroPedido),
      value: Number(valorTotal),
      creationDate: new Date(dataCriacao),
      items: mapItems(items),
    };

    // Cria o pedido no banco
    const order = await Order.create(mapped);
    return res.status(201).json(order);
  } catch (error) {
    // Trata erro de chave unica (pedido duplicado)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ja existe um pedido com este numero.",
      });
    }
    // Erro generico de servidor
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
    // Pega o body e evita erro caso venha vazio
    const body = req.body || {};

    // Se nao veio nada para atualizar, retorna erro
    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ message: "Envie um JSON com dados para atualizar." });
    }

    // Objeto que vai receber so os campos permitidos
    const updateData = {};

    // Atualiza valor total se vier no payload
    if (body.valorTotal !== undefined) {
      updateData.value = Number(body.valorTotal);
    }

    // Atualiza data de criacao se vier no payload
    if (body.dataCriacao !== undefined) {
      updateData.creationDate = new Date(body.dataCriacao);
    }

    // Atualiza itens se vier no payload
    if (body.items !== undefined) {
      // Valida se items eh um array com pelo menos 1 item
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return res
          .status(400)
          .json({ message: "'items' deve ser um array com itens." });
      }
      // Converte os itens para o formato salvo no banco
      updateData.items = mapItems(body.items);
    }

    // Se nenhum campo valido foi enviado, retorna erro
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message:
          "Nenhum campo valido para atualizar. Use valorTotal, dataCriacao ou items.",
      });
    }

    // Busca pelo orderId da rota e atualiza os campos permitidos
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      updateData,
      {
        // Retorna o documento ja atualizado
        new: true,
        // Garante validacoes do schema no update
        runValidators: true,
      },
    );

    // Se nao encontrou o pedido, retorna 404
    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido nao encontrado" });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    // Trata erro de chave unica (caso de duplicidade)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ja existe um pedido com este numero.",
      });
    }
    // Erro generico no processo de atualizacao
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
