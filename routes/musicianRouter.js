const express = require("express");
const router = express.Router();
const musicianController = require("../controllers/musicianController");

router.get(
  "/:musicianId/cooperation-requests",
  musicianController.getMusicianCooperationRequests
);

// Маршрут для створення музиканта
router.post("/", musicianController.createMusician);

// Маршрут для отримання музиканта за ідентифікатором
router.get("/:musician_id", musicianController.getMusicianById);

// Маршрут для оновлення музиканта
router.put("/:musician_id", musicianController.updateMusician);

// Маршрут для видалення музиканта
router.delete("/:musician_id", musicianController.deleteMusician);

// Маршрут для отримання всіх музикантів
router.get("/", musicianController.getAllMusicians);

// Маршрут для пошуку музикантів за інструментами
router.get(
  "/search/by-instruments",
  musicianController.getMusiciansByInstruments
);

// Маршрут для отримання інструментів за ідентифікатором музиканта
router.get(
  "/:musician_id/instruments",
  musicianController.getInstrumentsByMusicianId
);

// Маршрут для пошуку музикантів за жанрами
router.get("/search/by-genres", musicianController.getMusiciansByGenres);

// Маршрут для отримання жанрів за ідентифікатором музиканта
router.get("/:musician_id/genres", musicianController.getGenresByMusicianId);

module.exports = router;
