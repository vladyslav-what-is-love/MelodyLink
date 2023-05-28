const pool = require("../db");
const User = require("./user");

class Organizer {
  constructor(organizerData) {
    this.organizer_id = organizerData.organizer_id;
    this.user_id = organizerData.user_id;
    this.company = organizerData.company;
  }

  static async createOrganizer(user_id, company) {
    const query =
      "INSERT INTO organizers (user_id, company) VALUES ($1, $2) RETURNING *";
    const values = [user_id, company];

    try {
      const { rows } = await pool.query(query, values);
      const organizerData = rows[0];
      return new Organizer(organizerData);
    } catch (error) {
      throw new Error("Failed to create organizer");
    }
  }

  static async getOrganizerById(organizer_id) {
    const query = "SELECT * FROM organizers WHERE organizer_id = $1";
    const values = [organizer_id];

    try {
      const { rows } = await pool.query(query, values);
      const organizerData = rows[0];
      return new Organizer(organizerData);
    } catch (error) {
      throw new Error("Failed to get organizer");
    }
  }

  static async updateOrganizer(organizer_id, updates) {
    const query =
      "UPDATE organizers SET user_id = $1, company = $2 WHERE organizer_id = $3 RETURNING *";
    const { user_id, company } = updates;
    const values = [user_id, company, organizer_id];

    try {
      const { rows } = await pool.query(query, values);
      const organizerData = rows[0];
      return new Organizer(organizerData);
    } catch (error) {
      throw new Error("Failed to update organizer");
    }
  }

  static async deleteOrganizer(organizer_id) {
    const query = "DELETE FROM organizers WHERE organizer_id = $1";
    const values = [organizer_id];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete organizer");
    }
  }

  static async searchOrganizersByCompany(company) {
    const query = `
      SELECT o.*, u.*
      FROM organizers o
      JOIN users u ON o.user_id = u.user_id
      WHERE LOWER(o.company) LIKE LOWER($1)
    `;
    const values = [`%${company}%`];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => ({
        organizer: new Organizer(row),
        user: new User(row),
      }));
    } catch (error) {
      throw new Error("Failed to search organizers by company");
    }
  }
}

module.exports = Organizer;