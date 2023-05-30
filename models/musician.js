const pool = require("../db");
const User = require("./user");
const Instrument = require("./instrument");
const Genre = require("./genre");

class Musician {
  constructor(musicianData) {
    this.musicianId = musicianData.musician_id;
    this.user_id = musicianData.user_id;
    this.experience = musicianData.experience;
  }

  static async createMusician(user_id, experience) {
    const query =
      "INSERT INTO musician (user_id, experience) VALUES ($1, $2) RETURNING *";
    const values = [user_id, experience];

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

  static async updateMusician(musician_id, updates) {
    const {
      experience,
      instrumentsToAddArray,
      instrumentsToRemoveArray,
      genresToAddArray,
      genresToRemoveArray,
    } = updates;

    //console.log(updates);

    try {
      await pool.query("BEGIN");

      const query =
        "UPDATE musician SET experience = $1 WHERE musician_id = $2 RETURNING *";
      const values = [experience, musician_id];

      const { rows } = await pool.query(query, values);

      const updatedMusician = new Musician(rows[0]);

      if (instrumentsToAddArray && instrumentsToAddArray.length > 0) {
        await Musician.addInstrumentsToMusician(
          musician_id,
          instrumentsToAddArray
        );
      }

      if (instrumentsToRemoveArray && instrumentsToRemoveArray.length > 0) {
        await Musician.removeInstrumentsFromMusician(
          musician_id,
          instrumentsToRemoveArray
        );
      }

      if (genresToAddArray && genresToAddArray.length > 0) {
        await Musician.addGenresToMusician(musician_id, genresToAddArray);
      }

      if (genresToRemoveArray && genresToRemoveArray.length > 0) {
        await Musician.removeGenresFromMusician(
          musician_id,
          genresToRemoveArray
        );
      }

      await pool.query("COMMIT");

      return updatedMusician;
    } catch (error) {
      console.log(error);
      await pool.query("ROLLBACK");
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
    const query = `
      SELECT u.*, m.*
      FROM users u
      JOIN musician m ON u.user_id = m.user_id
      WHERE u.entity_type = 'musician'
    `;
    try {
      const { rows } = await pool.query(query);
      console.log(rows);
      return rows.map((row) => ({
        /*user: new User({
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone: row.phone,
          rating: row.rating,
          image: row.image,
          location: row.location,
          password: row.password,
          role_id: row.role_id,
          entity_type: row.entity_type,
        }),*/
        musician: new Musician({
          musician_id: row.musician_id,
          experience: row.experience,
          user_id: row.user_id,
        }),
      }));
    } catch (error) {
      console.log(error);
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
      SELECT instrument.instrument_id, instrument.instrument
      FROM instrument
      INNER JOIN musician_instrument ON instrument.instrument_id = musician_instrument.instrument_id
      WHERE musician_instrument.musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      //console.log(rows);
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
      console.log(rows);
      return rows.map((row) => new Genre(row));
    } catch (error) {
      throw new Error("Failed to get genres by musician ID");
    }
  }

  static async addInstrumentsToMusician(musicianId, instrumentIds) {
    try {
      const placeholders = instrumentIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const query = `
        INSERT INTO musician_instrument (musician_id, instrument_id)
        VALUES ${placeholders}
      `;

      const values = [musicianId, ...instrumentIds];

      await pool.query(query, values);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add instruments to musician");
    }
  }

  static async removeInstrumentsFromMusician(musicianId, instrumentIds) {
    const query = `
      DELETE FROM musician_instrument
      WHERE musician_id = $1 AND instrument_id IN (${instrumentIds
        .map((_, index) => `$${index + 2}`)
        .join(", ")})
    `;
    const values = [musicianId, ...instrumentIds];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to remove instruments from musician");
    }
  }

  static async addGenresToMusician(musicianId, genreIds) {
    try {
      const placeholders = genreIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const query = `
        INSERT INTO musician_genre (musician_id, genre_id)
        VALUES ${placeholders}
      `;

      const values = [musicianId, ...genreIds];

      await pool.query(query, values);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add genres to musician");
    }
  }

  static async removeGenresFromMusician(musicianId, genreIds) {
    const query = `
      DELETE FROM musician_genre
      WHERE musician_id = $1 AND genre_id IN (${genreIds
        .map((_, index) => `$${index + 2}`)
        .join(", ")})
    `;
    const values = [musicianId, ...genreIds];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to remove genres from musician");
    }
  }
}

module.exports = Musician;
