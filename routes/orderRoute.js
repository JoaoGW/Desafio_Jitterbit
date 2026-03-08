const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

router.post("/", controller.createOrder);
router.get("/:id", controller.getOrder);
router.get("/list", controller.listOrders);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

module.exports = router;
