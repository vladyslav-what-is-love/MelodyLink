const pool = require("../db");

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

  static async getNiceOrganizerByUserId(userId) {
    const query = `
      SELECT *
      FROM organizers
      WHERE user_id = $1
    `;
    const values = [userId];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      return new Organizer(rows[0]);
    } catch (error) {
      throw new Error("Failed to get organizer by user ID");
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
      return rows;
    } catch (error) {
      throw new Error("Failed to search organizers by company");
    }
  }

  static async getAllOrganizers() {
    const query = `
      SELECT u.*, o.*
      FROM users u
      JOIN organizers o ON u.user_id = o.user_id
      WHERE u.entity_type = 'organizer'
    `;
    try {
      const { rows } = await pool.query(query);
      //console.log(rows);
      return rows;
      /*return rows.map((row) => ({
        user: new User(row),
        organizer: new Organizer(row),
      }));*/
    } catch (error) {
      throw new Error("Failed to get organizers");
    }
  }

  static async getAllCompanies() {
    const query = "SELECT DISTINCT company FROM organizers";

    try {
      const { rows } = await pool.query(query);
      const companies = rows.map((row) => row.company);
      return companies;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get companies");
    }
  }

  static async getOrganizerCooperationRequests(organizer_id) {
    console.log(organizer_id);
    const query = `
      SELECT cr.*, m.*, u.*
      FROM cooperation_requests cr
      JOIN musician m ON cr.musician_id = m.musician_id
      JOIN users u ON m.user_id = u.user_id
      WHERE cr.organizer_id = $1
    `;
    const values = [organizer_id];

    try {
      const { rows } = await pool.query(query, values);
      console.log(rows);
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get all cooperation requests for organizer");
    }
  }
}

module.exports = Organizer;
