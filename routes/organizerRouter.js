const express = require("express");
const router = express.Router();
const organizerController = require("../controllers/organizerController");

// Маршрут для пошуку організаторів за компанією
router.get("/search", organizerController.searchOrganizersByCompany);
// Маршрут для створення організатора
router.post("/", organizerController.createOrganizer);

// Маршрут для отримання всіх компаній
router.get("/companies", organizerController.getAllCompanies);

// Маршрут для отримання організатора за ідентифікатором
router.get("/:organizer_id", organizerController.getOrganizerById);

// Маршрут для оновлення організатора
router.put("/:organizer_id", organizerController.updateOrganizer);

// Маршрут для видалення організатора
router.delete("/:organizer_id", organizerController.deleteOrganizer);

// Маршрут для отримання всіх організаторів
router.get("/", organizerController.getAllOrganizers);

module.exports = router;
