const pool = require("../db");
const Musician = require("./musician");

class User {
  constructor(userData) {
    this.userId = userData.user_id;
    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.email = userData.email;
    this.phone = userData.phone;
    this.rating = userData.rating;
    this.image = userData.image;
    this.location = userData.location;
    this.password = userData.password;
    this.roleId = userData.role_id;
    this.entityType = userData.entity_type;
  }

  static async createUser(
    firstName,
    lastName,
    email,
    phone,
    rating,
    image,
    location,
    password,
    roleName,
    entityType
  ) {
    const roleId = await this.getRoleIdByName(roleName); // Отримання role_id на основі назви ролі

    const query =
      "INSERT INTO users (first_name, last_name, email, phone, rating, image, location, password, role_id, entity_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const values = [
      firstName,
      lastName,
      email,
      phone,
      rating,
      image,
      location,
      password,
      roleId,
      entityType,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return new User(rows[0]);
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  static async getRoleIdByName(roleName) {
    const query = "SELECT role_id FROM roles WHERE role_name = $1";
    const values = [roleName];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length > 0) {
        return rows[0].role_id;
      } else {
        throw new Error(`Role '${roleName}' not found`);
      }
    } catch (error) {
      throw new Error("Failed to get role");
    }
  }

  static async getUserById(userId) {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const values = [userId];

    try {
      const { rows } = await pool.query(query, values);
      return new User(rows[0]);
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
      rating,
      image,
      location,
      password,
      roleName,
      entityType,
    } = updates;
    const roleId = await this.getRoleIdByName(roleName);

    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, phone = $4, rating = $5, image = $6, location = $7, password = $8, role_id = $9, entity_type = $10
      WHERE user_id = $11
      RETURNING *
    `;
    const values = [
      firstName,
      lastName,
      email,
      phone,
      rating,
      image,
      location,
      password,
      roleId,
      entityType,
      userId,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return new User(rows[0]);
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

  static async getAllUsers() {
    const query = "SELECT * FROM users";
    try {
      const { rows } = await pool.query(query);
      return rows.map((row) => new User(row));
    } catch (error) {
      throw new Error("Failed to get users");
    }
  }

  static async getRoleIdByName(roleName) {
    const query = "SELECT role_id FROM roles WHERE role_name = $1";
    const values = [roleName];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        throw new Error(`Role '${roleName}' not found`);
      }
      return rows[0].role_id;
    } catch (error) {
      throw new Error("Failed to get role");
    }
  }
}

module.exports = User;
