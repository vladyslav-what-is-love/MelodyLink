const express = require("express");
const router = express.Router();
const CooperationRequestController = require("../controllers/cooperationRequestController");

// Маршрут для створення запиту на співпрацю
router.post("/", CooperationRequestController.createCooperationRequest);

// Маршрут для отримання запиту на співпрацю за ідентифікатором
router.get(
  "/:requestId",
  CooperationRequestController.getCooperationRequestById
);

// Маршрут для оновлення запиту на співпрацю
router.put(
  "/:requestId",
  CooperationRequestController.updateCooperationRequest
);

// Маршрут для видалення запиту на співпрацю
router.delete(
  "/:requestId",
  CooperationRequestController.deleteCooperationRequest
);

// Маршрут для отримання всіх запитів на співпрацю музиканта
router.get(
  "/musician/:musicianId",
  CooperationRequestController.getRequestsByMusicianId
);

// Маршрут для отримання всіх запитів на співпрацю організатора
router.get(
  "/organizer/:organizerId",
  CooperationRequestController.getRequestsByOrganizerId
);

// Маршрут для отримання всіх запитів на співпрацю з певним статусом
router.get(
  "/status/:status",
  CooperationRequestController.getCooperationRequestsByStatus
);

// Маршрут для отримання музиканта, пов'язаного з запитом на співпрацю
router.get("/:requestId/musician", CooperationRequestController.getMusician);

// Маршрут для отримання організатора, пов'язаного з запитом на співпрацю
router.get("/:requestId/organizer", CooperationRequestController.getOrganizer);

// Маршрут для отримання всіх запитів на співпрацю за певною датою
router.get(
  "/date/:requestDate",
  CooperationRequestController.getRequestsByDate
);

router.get("/", CooperationRequestController.getAllCooperationRequests);

module.exports = router;
