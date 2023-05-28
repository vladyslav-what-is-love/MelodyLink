const pool = require("../db");

class Instrument {
  static async createInstrument(instrumentName) {
    const query = "INSERT INTO instrument (instrument) VALUES ($1) RETURNING *";
    const values = [instrumentName];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to create instrument");
    }
  }

  static async getInstrumentById(instrumentId) {
    const query = "SELECT * FROM instrument WHERE instrument_id = $1";
    const values = [instrumentId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to get instrument");
    }
  }

  static async getAllInstruments() {
    const query = "SELECT * FROM instrument";

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error("Failed to get instruments");
    }
  }

  static async deleteInstrument(instrumentId) {
    const query = `
      DELETE FROM instrument
      WHERE instrument_id = $1
    `;
    const values = [instrumentId];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete instrument");
    }
  }
}

module.exports = Instrument;
