const pool = require("../db");

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

  static async getUserByMusicianId(musicianId) {
    const query = `
      SELECT *
      FROM users
      WHERE user_id = (
        SELECT user_id
        FROM musician
        WHERE musician_id = $1
      )
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      return new User(rows[0]);
    } catch (error) {
      throw new Error("Failed to get user by musician ID");
    }
  }

  static async getMusicianByUserId(userId) {
    const query = `
      SELECT *
      FROM musician
      WHERE user_id = $1
    `;
    const values = [userId];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      return new Musician(rows[0]);
    } catch (error) {
      throw new Error("Failed to get musician by user ID");
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
      return rows;

      /*return rows.map((row) => ({
        user: new User({
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
        }),
        musician: new Musician({
          musician_id: row.musician_id,
          experience: row.experience,
          user_id: row.user_id,
        }),
      }));*/
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get musicians");
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
    const { experience, genres, instruments } = updates;

    try {
      await pool.query("BEGIN");

      const query = `
        UPDATE musician
        SET experience = COALESCE($1, experience)
        WHERE musician_id = $2
        RETURNING *
      `;

      const values = [experience, musicianId];

      const { rows } = await pool.query(query, values);

      const updatedMusician = new Musician(rows[0]);

      if (Array.isArray(instruments) && instruments.length > 0) {
        const existingInstruments = await Musician.getInstrumentsByMusicianId(
          musicianId
        );

        const existingInstrumentIds = existingInstruments.map(
          (instrument) => instrument.instrument_id
        );

        const new_instruments = [];
        for (let i = 0; i < instruments.length; i++) {
          new_instruments.push(Number(instruments[i]));
        }

        const instrumentsToAdd = new_instruments.filter(
          (instrument) => !existingInstrumentIds.includes(instrument)
        );

        const instrumentsToRemove = existingInstrumentIds.filter(
          (instrument) => !new_instruments.includes(instrument)
        );

        if (instrumentsToAdd.length > 0) {
          await Musician.addInstrumentsToMusician(musicianId, instrumentsToAdd);
        }

        if (instrumentsToRemove.length > 0) {
          await Musician.removeInstrumentsFromMusician(
            musicianId,
            instrumentsToRemove
          );
        }
      }

      if (Array.isArray(genres) && genres.length > 0) {
        const existingGenres = await Musician.getGenresByMusicianId(musicianId);

        const existingGenreIds = existingGenres.map((genre) => genre.genre_id);

        const new_genres = [];
        for (let i = 0; i < genres.length; i++) {
          new_genres.push(Number(genres[i]));
        }

        const genresToAdd = new_genres.filter(
          (genre) => !existingGenreIds.includes(genre)
        );

        const genresToRemove = existingGenreIds.filter(
          (existingGenre) => !new_genres.includes(existingGenre)
        );

        if (genresToAdd.length > 0) {
          await Musician.addGenresToMusician(musicianId, genresToAdd);
        }

        if (genresToRemove.length > 0) {
          await Musician.removeGenresFromMusician(musicianId, genresToRemove);
        }
      }

      await pool.query("COMMIT");

      return updatedMusician;
    } catch (error) {
      await pool.query("ROLLBACK");
      console.log(error);
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
  static deleteMusicianByUserId(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const musician = await Musician.getMusicianByUserId(userId);
        if (musician) {
          const musicianId = musician.musician_id;
          const queryDeleteInstruments =
            "DELETE FROM musician_instruments WHERE musician_id = $1";
          const queryDeleteGenres =
            "DELETE FROM musician_genres WHERE musician_id = $1";
          const queryDeleteMusician =
            "DELETE FROM musician WHERE musician_id = $1";

          await pool.query(queryDeleteInstruments, [musicianId]);
          await pool.query(queryDeleteGenres, [musicianId]);
          await pool.query(queryDeleteMusician, [musicianId]);

          console.log("Musician deleted successfully");
        }

        resolve();
      } catch (error) {
        console.log(error);
        reject("Failed to delete musician");
      }
    });
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
      return rows.map((row) => new Instrument(row));
    } catch (error) {
      throw new Error("Failed to get instruments by musician ID");
    }
  }

  static async getMusiciansByInstruments(instrumentIds) {
    const query = `
      SELECT musician.*, users.*
      FROM musician
      INNER JOIN musician_instrument ON musician.musician_id = musician_instrument.musician_id
      INNER JOIN users ON musician.user_id = users.user_id
      WHERE musician_instrument.instrument_id IN (${instrumentIds
        .map((_, index) => `$${index + 1}`)
        .join(", ")})
    `;
    const values = instrumentIds;

    try {
      const { rows } = await pool.query(query, values);

      return rows.map((row) => ({
        musician_id: row.musician_id,
        user_id: row.user_id,
        experience: row.experience,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        rating: row.rating,
        image: row.image,
        location: row.location,
        entity_type: row.entity_type,
        role_id: row.role_id,
      }));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get musicians by instruments");
    }
  }

  static async getMusiciansByGenres(genreIds) {
    const query = `
      SELECT musician.*, users.*
      FROM musician
      INNER JOIN musician_genre ON musician.musician_id = musician_genre.musician_id
      INNER JOIN users ON musician.user_id = users.user_id
      WHERE musician_genre.genre_id IN (${genreIds
        .map((_, index) => `$${index + 1}`)
        .join(", ")})
    `;
    const values = genreIds;

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => ({
        musician_id: row.musician_id,
        user_id: row.user_id,
        experience: row.experience,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        rating: row.rating,
        image: row.image,
        location: row.location,
        entity_type: row.entity_type,
        role_id: row.role_id,
      }));
    } catch (error) {
      console.log(error);
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

  static async getMusicianCooperationRequests(musicianId) {
    const query = `
      SELECT cr.*, o.*, u.*
      FROM cooperation_requests cr
      JOIN organizers o ON cr.organizer_id = o.organizer_id
      JOIN users u ON o.user_id = u.user_id
      WHERE cr.musician_id = $1
    `;
    const values = [musicianId];

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get all cooperation requests for musician");
    }
  }
}

module.exports = Musician;
