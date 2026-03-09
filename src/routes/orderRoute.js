// (Documentação automaticamente gerada pelo Copilot)
const express = require("express");
const controller = require("../controllers/orderController");
const auth = require("../middleware/auth");

const router = express.Router();

// Todas as rotas de pedido exigem token JWT.
router.use(auth);

// Cria pedido.
router.post("/", controller.createOrder);

// Lista pedidos.
router.get("/list", controller.listOrders);

// Busca pedido por orderId.
router.get("/:id", controller.getOrder);

// Atualiza pedido por orderId.
router.put("/:id", controller.updateOrder);

// Deleta pedido por orderId.
router.delete("/:id", controller.deleteOrder);

module.exports = router;
