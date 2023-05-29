const express = require("express");
const router = express.Router();
const instrumentController = require("../controllers/instrumentController");

// Маршрут для створення інструмента
router.post("/", instrumentController.createInstrument);

// Маршрут для отримання інструмента за ідентифікатором
router.get("/:instrumentId", instrumentController.getInstrumentById);

// Маршрут для видалення інструмента за ідентифікатором
router.delete("/:instrumentId", instrumentController.deleteInstrument);

// Маршрут для отримання всіх інструментів
router.get("/", instrumentController.getAllInstruments);

module.exports = router;
