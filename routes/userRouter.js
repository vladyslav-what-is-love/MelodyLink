const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Маршрут для створення користувача
router.post("/", userController.createUser);

// Маршрут для отримання користувача за ідентифікатором
router.get("/:userId", userController.getUserById);

// Маршрут для оновлення користувача
router.put("/:userId", userController.updateUser);

// Маршрут для видалення користувача
router.delete("/:userId", userController.deleteUser);

// Маршрут для отримання всіх користувачів
router.get("/", userController.getAllUsers);

module.exports = router;
