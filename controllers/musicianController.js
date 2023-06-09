const Musician = require("../models/musician");
const User = require("../models/user");

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
      const genres = await Musician.getGenresByMusicianId(musician_id);
      const instruments = await Musician.getInstrumentsByMusicianId(
        musician_id
      );
      const musicianWithDetails = {
        experience: musician.experience,
        genres,
        instruments,
      };
      res.json(musicianWithDetails);
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
  const {
    experience,
    instrumentsToAdd,
    instrumentsToRemove,
    genresToAdd,
    genresToRemove,
  } = req.body;

  const instrumentsToAddArray = instrumentsToAdd
    ? instrumentsToAdd
        .split(",")
        .map((element) => parseInt(element.trim(), 10))
        .filter((element) => !isNaN(element))
    : [];

  const instrumentsToRemoveArray = instrumentsToRemove
    ? instrumentsToRemove
        .split(",")
        .map((element) => parseInt(element.trim(), 10))
        .filter((element) => !isNaN(element))
    : [];

  const genresToAddArray = genresToAdd
    ? genresToAdd
        .split(",")
        .map((element) => parseInt(element.trim(), 10))
        .filter((element) => !isNaN(element))
    : [];

  const genresToRemoveArray = genresToRemove
    ? genresToRemove
        .split(",")
        .map((element) => parseInt(element.trim(), 10))
        .filter((element) => !isNaN(element))
    : [];

  try {
    const updates = {
      experience,
      instrumentsToAddArray,
      instrumentsToRemoveArray,
      genresToAddArray,
      genresToRemoveArray,
    };
    const musician = await Musician.updateMusician(musician_id, updates);

    if (musician) {
      const instruments = await Musician.getInstrumentsByMusicianId(
        musician_id
      );

      const genres = await Musician.getGenresByMusicianId(musician_id);

      res.json({ musician, instruments, genres });
    } else {
      res.status(404).json({ error: "Musician not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update musician" });
  }
};

// Контролер для видалення музиканта
const deleteMusician = async (req, res) => {
  const { musician_id } = req.params;

  try {
    await Musician.deleteMusician(musician_id);
    res.json({ message: "Musician deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete musician" });
  }
};

// Контролер для отримання всіх музикантів
const getAllMusicians = async (req, res) => {
  try {
    const musicians = await Musician.getAllMusicians();

    const musiciansWithDetails = await Promise.all(
      musicians.map(async (musician) => {
        const genres = await Musician.getGenresByMusicianId(
          musician.musician_id
        );
        const instruments = await Musician.getInstrumentsByMusicianId(
          musician.musician_id
        );
        const user = await User.getUserById(musician.user_id);

        return {
          experience: musician.experience,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          rating: user.rating,
          image: user.image,
          location: user.location,
          roleId: user.roleId,
          entityType: user.entityType,
          genres,
          instruments,
        };
      })
    );

    res.json(musiciansWithDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to get musicians" });
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

// Контролер для пошуку музикантів за інструментами
const getMusiciansByInstruments = async (req, res) => {
  const { instrumentIds } = req.query;

  const parsedIds = JSON.parse(instrumentIds);

  const ids = parsedIds.map((id) => parseInt(id));
  try {
    const musicians = await Musician.getMusiciansByInstruments(ids);
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get musicians by instruments" });
  }
};

// Контролер для пошуку музикантів за жанрами
const getMusiciansByGenres = async (req, res) => {
  const { genreIds } = req.query;

  const parsedIds = JSON.parse(genreIds);

  const ids = parsedIds.map((id) => parseInt(id));

  try {
    const musicians = await Musician.getMusiciansByGenres(ids);
    res.json(musicians);
  } catch (error) {
    console.log(error);
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

const getMusicianCooperationRequests = async (req, res) => {
  const { musicianId } = req.params;
  try {
    const cooperationRequests = await Musician.getMusicianCooperationRequests(
      musicianId
    );
    res.status(200).json({ cooperationRequests });
  } catch (error) {
    res.status(500).json({ error: "Failed to get cooperation requests" });
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
  getMusicianCooperationRequests,
};
