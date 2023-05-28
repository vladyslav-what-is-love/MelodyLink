const Genre = require("../models/genre");

// Контролер для створення жанру
async function createGenre(req, res) {
  try {
    const { genre } = req.body;
    const createdGenre = await Genre.createGenre(genre);
    res.json(createdGenre);
  } catch (error) {
    res.status(500).json({ error: "Failed to create genre" });
  }
}

// Контролер для отримання жанру за ідентифікатором
async function getGenreById(req, res) {
  try {
    const { genreId } = req.params;
    const genre = await Genre.getGenreById(genreId);
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: "Failed to get genre" });
  }
}

// Контролер для видалення жанру за ідентифікатором
async function deleteGenre(req, res) {
  try {
    const { genreId } = req.params;
    await Genre.deleteGenre(genreId);
    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete genre" });
  }
}

// Контролер для отримання всіх жанрів
async function getAllGenres(req, res) {
  try {
    const genres = await Genre.getAllGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to get genres" });
  }
}

module.exports = {
  createGenre,
  getGenreById,
  deleteGenre,
  getAllGenres,
};
