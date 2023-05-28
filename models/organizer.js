const pool = require("../db");

class Organizer {
  static async createOrganizer(userId, company) {
    const query = `
      INSERT INTO organizers (user_id, company)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [userId, company];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to create organizer");
    }
  }

  static async getOrganizerById(organizerId) {
    const query = `
      SELECT * FROM organizers
      WHERE organizer_id = $1
    `;
    const values = [organizerId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to get organizer");
    }
  }

  static async updateOrganizer(organizerId, updates) {
    const { userId, company } = updates;
    const query = `
      UPDATE organizers
      SET user_id = $1, company = $2
      WHERE organizer_id = $3
      RETURNING *
    `;
    const values = [userId, company, organizerId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update organizer");
    }
  }

  static async deleteOrganizer(organizerId) {
    const query = `
      DELETE FROM organizers
      WHERE organizer_id = $1
    `;
    const values = [organizerId];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete organizer");
    }
  }

  static async searchOrganizersByCompany(company) {
    const query = `
      SELECT * FROM organizers
      WHERE LOWER(company) LIKE LOWER($1)
    `;
    const values = [`%${company}%`];

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      throw new Error("Failed to search organizers by company");
    }
  }
}

module.exports = Organizer;
