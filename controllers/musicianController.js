const Musician = require("../models/musician");

// Контролер для створення музиканта
const createMusician = async (req, res) => {
  const { user_id, experience } = req.body;

  try {
    const musician = await Musician.createMusician(user_id, experience);
    res.status(201).json(musician);
  } catch (error) {
    res.status(500).json({ error: "Failed to create musician" });
  }
};

// Контролер для отримання музиканта за ідентифікатором
const getMusicianById = async (req, res) => {
  const { musician_id } = req.params;

  try {
    const musician = await Musician.getMusicianById(musician_id);
    if (musician) {
      res.json(musician);
    } else {
      res.status(404).json({ error: "Musician not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get musician" });
  }
};

// Контролер для оновлення музиканта
const updateMusician = async (req, res) => {
  const { musician_id } = req.params;
  const { user_id, experience } = req.body;

  try {
    const updates = { user_id, experience };
    const musician = await Musician.updateMusician(musician_id, updates);
    if (musician) {
      res.json(musician);
    } else {
      res.status(404).json({ error: "Musician not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update musician" });
  }
};

// Контролер для видалення музиканта
const deleteMusician = async (req, res) => {
  const { musician_id } = req.params;

  try {
    await Musician.deleteMusician(musician_id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete musician" });
  }
};

// Контролер для отримання всіх музикантів
const getAllMusicians = async (req, res) => {
  try {
    const musicians = await Musician.getAllMusicians();
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get musicians" });
  }
};

// Контролер для пошуку музикантів за інструментами
const getMusiciansByInstruments = async (req, res) => {
  const { instrumentIds } = req.query;

  try {
    const musicians = await Musician.getMusiciansByInstruments(instrumentIds);
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get musicians by instruments" });
  }
};

// Контролер для отримання інструментів за ідентифікатором музиканта
const getInstrumentsByMusicianId = async (req, res) => {
  const { musician_id } = req.params;

  try {
    const instruments = await Musician.getInstrumentsByMusicianId(musician_id);
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get instruments by musician ID" });
  }
};

// Контролер для пошуку музикантів за жанрами
const getMusiciansByGenres = async (req, res) => {
  const { genreIds } = req.query;

  try {
    const musicians = await Musician.getMusiciansByGenres(genreIds);
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get musicians by genres" });
  }
};

// Контролер для отримання жанрів за ідентифікатором музиканта
const getGenresByMusicianId = async (req, res) => {
  const { musician_id } = req.params;

  try {
    const genres = await Musician.getGenresByMusicianId(musician_id);
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to get genres by musician ID" });
  }
};

module.exports = {
  createMusician,
  getMusicianById,
  updateMusician,
  deleteMusician,
  getAllMusicians,
  getMusiciansByInstruments,
  getInstrumentsByMusicianId,
  getMusiciansByGenres,
  getGenresByMusicianId,
};
