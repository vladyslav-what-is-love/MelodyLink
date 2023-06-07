const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Маршрут для логіну
router.post("/", userController.login);

module.exports = router;
