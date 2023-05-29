const pool = require("../db");
const User = require("./user");
const Instrument = require("./instrument");
const Genre = require("./genre");

class Musician {
  constructor(musicianData) {
    this.musicianId = musicianData.musician_id;
    this.userId = musicianData.user_id;
    this.instrumentId = musicianData.instrument_id;
    this.genreId = musicianData.genre_id;
    this.experience = musicianData.experience;
  }

  static async createMusician(userId, experience) {
    const query =
      "INSERT INTO musician (user_id, experience) VALUES ($1, $2) RETURNING *";
    const values = [userId, experience];

    try {
      const { rows } = await pool.query(query, values);
      return new Musician(rows[0]);
    } catch (error) {
      throw new Error("Failed to create musician");
    }
  }

  static async getMusicianById(musicianId) {
    const query = "SELECT * FROM musician WHERE musician_id = $1";
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return new Musician(rows[0]);
    } catch (error) {
      throw new Error("Failed to get musician");
    }
  }

  static async updateMusician(musicianId, updates) {
    const { userId, experience } = updates;
    const query =
      "UPDATE musician SET user_id = $1, experience = $2 WHERE musician_id = $3 RETURNING *";
    const values = [userId, experience, musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return new Musician(rows[0]);
    } catch (error) {
      throw new Error("Failed to update musician");
    }
  }

  static async deleteMusician(musicianId) {
    const query = "DELETE FROM musician WHERE musician_id = $1";
    const values = [musicianId];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete musician");
    }
  }

  static async getAllMusicians() {
    const query = "SELECT * FROM musician";
    try {
      const { rows } = await pool.query(query);
      return rows.map((row) => new Musician(row));
    } catch (error) {
      throw new Error("Failed to get musicians");
    }
  }

  static async getMusiciansByInstruments(instrumentIds) {
    const query = `
      SELECT musician.*
      FROM musician
      INNER JOIN musician_instrument ON musician.musician_id = musician_instrument.musician_id
      WHERE musician_instrument.instrument_id IN (${instrumentIds
        .map((_, index) => `$${index + 1}`)
        .join(", ")})
    `;
    const values = instrumentIds;

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new Musician(row));
    } catch (error) {
      throw new Error("Failed to get musicians by instruments");
    }
  }

  static async getInstrumentsByMusicianId(musicianId) {
    const query = `
      SELECT instrument.*
      FROM instrument
      INNER JOIN musician_instrument ON instrument.instrument_id = musician_instrument.instrument_id
      WHERE musician_instrument.musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new Instrument(row));
    } catch (error) {
      throw new Error("Failed to get instruments by musician ID");
    }
  }

  static async getMusiciansByGenres(genreIds) {
    const query = `
      SELECT musician.*
      FROM musician
      INNER JOIN musician_genre ON musician.musician_id = musician_genre.musician_id
      WHERE musician_genre.genre_id IN (${genreIds
        .map((_, index) => `$${index + 1}`)
        .join(", ")})
    `;
    const values = genreIds;

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new Musician(row));
    } catch (error) {
      throw new Error("Failed to get musicians by genres");
    }
  }

  static async getGenresByMusicianId(musicianId) {
    const query = `
      SELECT genre.*
      FROM genre
      INNER JOIN musician_genre ON genre.genre_id = musician_genre.genre_id
      WHERE musician_genre.musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new Genre(row));
    } catch (error) {
      throw new Error("Failed to get genres by musician ID");
    }
  }
}

module.exports = Musician;
