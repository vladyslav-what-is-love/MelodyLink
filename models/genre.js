const pool = require("../db");

class Genre {
  static async createGenre(genre) {
    console.log("Received genre:", genre);
    const query = `
      INSERT INTO genre (genre)
      VALUES ($1)
      RETURNING *
    `;
    const values = [genre];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to create genre");
    }
  }

  static async getGenreById(genreId) {
    const query = `
      SELECT *
      FROM genre
      WHERE genre_id = $1
    `;
    const values = [genreId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to get genre by ID");
    }
  }

  static async deleteGenre(genreId) {
    const query = `
      DELETE FROM genre
      WHERE genre_id = $1
    `;
    const values = [genreId];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete genre");
    }
  }

  static async getAllGenres() {
    const query = `
      SELECT *
      FROM genre
    `;

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Failed to get all genres");
    }
  }
}

module.exports = Genre;
