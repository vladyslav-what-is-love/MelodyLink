const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");

// Маршрут для створення жанру
router.post("/", genreController.createGenre);

// Маршрут для отримання жанру за ідентифікатором
router.get("/:genreId", genreController.getGenreById);

// Маршрут для видалення жанру за ідентифікатором
router.delete("/:genreId", genreController.deleteGenre);

// Маршрут для отримання всіх жанрів
router.get("/", genreController.getAllGenres);

module.exports = router;
