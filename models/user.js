const pool = require("../db");

class User {
  static async createUser(
    firstName,
    lastName,
    email,
    phone,
    image,
    rating,
    location,
    password,
    entityType
  ) {
    // Отримати ID ролі "user"
    const roleId = await this.getUserRoleId("user");

    const query =
      "INSERT INTO users (first_name, last_name, email, phone, image, rating, location, password, role_id, entity_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const values = [
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
      password,
      roleId,
      entityType,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  static async getUserById(userId) {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [userId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to get user");
    }
  }

  static async updateUser(userId, updates) {
    const {
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
      password,
    } = updates;
    const query =
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, image = $5, rating = $6, location = $7, password = $8 WHERE user_id = $9 RETURNING *";
    const values = [
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
      password,
      userId,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  static async deleteUser(userId) {
    const query = "DELETE FROM users WHERE user_id = $1";
    const values = [userId];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }

  static async getUserRole(userId) {
    const query =
      "SELECT roles.role_name FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE user_id = $1";
    const values = [userId];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0].role_name;
    } catch (error) {
      throw new Error("Failed to get user role");
    }
  }

  static async updateUserByMusicianId(musicianId, updates) {
    const { firstName, lastName, email, phone, image, rating, location } =
      updates;

    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, phone = $4, image = $5, rating = $6, location = $7
      FROM musician
      WHERE musician.musician_id = $8 AND musician.user_id = users.user_id
      RETURNING users.*
    `;
    const values = [
      firstName,
      lastName,
      email,
      phone,
      image,
      rating,
      location,
      musicianId,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }
}

module.exports = User;
