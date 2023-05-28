const pool = require("../db");
const User = require("./user");
const Instrument = require("./instrument");

class Musician {
  static async createMusician(userId, instrumentIds, genreIds, experience) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const musicianQuery =
        "INSERT INTO musician (user_id, experience) VALUES ($1, $2) RETURNING musician_id";
      const musicianValues = [userId, experience];
      const musicianResult = await client.query(musicianQuery, musicianValues);
      const musicianId = musicianResult.rows[0].musician_id;

      const musicianInstrumentQuery =
        "INSERT INTO musician_instrument (musician_id, instrument_id) VALUES ($1, $2)";
      const musicianGenreQuery =
        "INSERT INTO musician_genre (musician_id, genre_id) VALUES ($1, $2)";

      for (const instrumentId of instrumentIds) {
        const instrumentValues = [musicianId, instrumentId];
        await client.query(musicianInstrumentQuery, instrumentValues);
      }

      for (const genreId of genreIds) {
        const genreValues = [musicianId, genreId];
        await client.query(musicianGenreQuery, genreValues);
      }

      await client.query("COMMIT");

      return musicianId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error("Failed to create musician");
    } finally {
      client.release();
    }
  }

  static async getMusicianById(musicianId) {
    const query = `
      SELECT m.musician_id, m.user_id, u.first_name, u.last_name, u.email, u.phone, u.image, u.rating,
        u.location, r.role_id, r.role_name, mi.instrument_id, i.instrument, mg.genre_id, g.genre, m.experience
      FROM musician AS m
      JOIN users AS u ON m.user_id = u.user_id
      JOIN roles AS r ON u.role_id = r.role_id
      LEFT JOIN musician_instrument AS mi ON m.musician_id = mi.musician_id
      LEFT JOIN instrument AS i ON mi.instrument_id = i.instrument_id
      LEFT JOIN musician_genre AS mg ON m.musician_id = mg.musician_id
      LEFT JOIN genre AS g ON mg.genre_id = g.genre_id
      WHERE m.musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to get musician");
    }
  }

  static async updateMusician(musicianId, updates) {
    const {
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
      instrumentIds,
      genreIds,
      experience,
    } = updates;

    const userUpdates = {
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
    };

    await User.updateUserByMusicianId(musicianId, userUpdates);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateMusicianQuery = `
        UPDATE musician SET experience = $1 WHERE musician_id = $2
      `;
      const updateMusicianValues = [experience, musicianId];
      await client.query(updateMusicianQuery, updateMusicianValues);

      const deleteInstrumentQuery =
        "DELETE FROM musician_instrument WHERE musician_id = $1";
      const deleteGenreQuery =
        "DELETE FROM musician_genre WHERE musician_id = $1";
      await client.query(deleteInstrumentQuery, [musicianId]);
      await client.query(deleteGenreQuery, [musicianId]);

      const musicianInstrumentQuery =
        "INSERT INTO musician_instrument (musician_id, instrument_id) VALUES ($1, $2)";
      const musicianGenreQuery =
        "INSERT INTO musician_genre (musician_id, genre_id) VALUES ($1, $2)";

      for (const instrumentId of instrumentIds) {
        const instrumentValues = [musicianId, instrumentId];
        await client.query(musicianInstrumentQuery, instrumentValues);
      }

      for (const genreId of genreIds) {
        const genreValues = [musicianId, genreId];
        await client.query(musicianGenreQuery, genreValues);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error("Failed to update musician");
    } finally {
      client.release();
    }
  }

  static async getAllMusicians() {
    const query = "SELECT * FROM musician";

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Failed to get musicians");
    }
  }

  static async getMusiciansByInstruments(instrumentIds) {
    const query = `
      SELECT * 
      FROM musician 
      INNER JOIN musician_instrument ON musician.musician_id = musician_instrument.musician_id 
      WHERE musician_instrument.instrument_id IN (${instrumentIds
        .map((_, index) => `$${index + 1}`)
        .join(", ")})
    `;
    const values = instrumentIds;

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw new Error("Failed to get musicians by instruments");
    }
  }

  static async getInstrumentsByMusicianId(musicianId) {
    const query = `
      SELECT instrument_id
      FROM musician_instrument
      WHERE musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      const instrumentIds = rows.map((row) => row.instrument_id);
      const instruments = await Instrument.getInstrumentsByIds(instrumentIds);
      return instruments;
    } catch (error) {
      throw new Error("Failed to get instruments by musician ID");
    }
  }
}

module.exports = Musician;
