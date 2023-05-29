const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

// Маршрут для створення організатора
router.post("/", organizerController.createOrganizer);

// Маршрут для отримання організатора за ідентифікатором
router.get("/:organizer_id", organizerController.getOrganizerById);

// Маршрут для оновлення організатора
router.put("/:organizer_id", organizerController.updateOrganizer);

// Маршрут для видалення організатора
router.delete("/:organizer_id", organizerController.deleteOrganizer);

// Маршрут для пошуку організаторів за компанією
router.get("/search", organizerController.searchOrganizersByCompany);

module.exports = router;
