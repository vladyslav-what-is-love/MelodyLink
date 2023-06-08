const pool = require("../db");
const Musician = require("./musician");
const Organizer = require("./organizer");

class CooperationRequest {
  constructor(requestData) {
    this.request_id = requestData.request_id;
    this.musician_id = requestData.musician_id;
    this.organizer_id = requestData.organizer_id;
    this.request_date = requestData.request_date;
    this.status = requestData.status;
  }

  static async createCooperationRequest(
    musician_id,
    organizer_id,
    request_date,
    status
  ) {
    const query =
      "INSERT INTO cooperation_requests (musician_id, organizer_id, request_date, status) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [musician_id, organizer_id, request_date, status];
    console.log(query);
    try {
      const { rows } = await pool.query(query, values);
      const requestData = rows[0];
      return new CooperationRequest(requestData);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create cooperation request");
    }
  }

  static async getCooperationRequestById(request_id) {
    const query = "SELECT * FROM cooperation_requests WHERE request_id = $1";
    const values = [request_id];

    try {
      const { rows } = await pool.query(query, values);
      const requestData = rows[0];
      return new CooperationRequest(requestData);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get cooperation request");
    }
  }

  static async updateCooperationRequest(request_id, updates) {
    const query =
      "UPDATE cooperation_requests SET musician_id = $1, organizer_id = $2, request_date = $3, status = $4 WHERE request_id = $5 RETURNING *";
    const { musician_id, organizer_id, request_date, status } = updates;
    const values = [
      musician_id,
      organizer_id,
      request_date,
      status,
      request_id,
    ];

    try {
      const { rows } = await pool.query(query, values);
      const requestData = rows[0];
      return new CooperationRequest(requestData);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update cooperation request");
    }
  }

  static async deleteCooperationRequest(request_id) {
    const query = "DELETE FROM cooperation_requests WHERE request_id = $1";
    const values = [request_id];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete cooperation request");
    }
  }

  static async getRequestsByMusicianId(musician_id) {
    const query = "SELECT * FROM cooperation_requests WHERE musician_id = $1";
    const values = [musician_id];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new CooperationRequest(row));
    } catch (error) {
      throw new Error("Failed to get requests by musician ID");
    }
  }

  static async getRequestsByOrganizerId(organizer_id) {
    const query = "SELECT * FROM cooperation_requests WHERE organizer_id = $1";
    const values = [organizer_id];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new CooperationRequest(row));
    } catch (error) {
      throw new Error("Failed to get requests by organizer ID");
    }
  }

  static async getCooperationRequestsByStatus(status) {
    const query = "SELECT * FROM cooperation_requests WHERE status = $1";
    const values = [status];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new CooperationRequest(row));
    } catch (error) {
      throw new Error("Failed to get cooperation requests by status");
    }
  }

  async getMusician() {
    return Musician.getMusicianById(this.musician_id);
  }

  async getOrganizer() {
    return Organizer.getOrganizerById(this.organizer_id);
  }

  static async getRequestsByDate(request_date) {
    const query = "SELECT * FROM cooperation_requests WHERE request_date = $1";
    const values = [request_date];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new CooperationRequest(row));
    } catch (error) {
      throw new Error("Failed to get cooperation requests by date");
    }
  }

  static async getAllCooperationRequests() {
    const query = `
    SELECT cr.*, m.*, o.*
    FROM cooperation_requests cr
    JOIN musician m ON cr.musician_id = m.musician_id
    JOIN organizers o ON cr.organizer_id = o.organizer_id
  `;
    try {
      const { rows } = await pool.query(query);
      return rows.map((row) => ({
        cooperationRequest: new CooperationRequest(row),
        musician: new Musician(row),
        organizer: new Organizer(row),
      }));
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get all cooperation requests");
    }
  }
}

module.exports = CooperationRequest;
