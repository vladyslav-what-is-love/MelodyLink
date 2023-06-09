const pool = require("../db");
const Musician = require("./musician");
const Organizer = require("./organizer");

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
      console.log(error);
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
      company,
      genres,
      instruments,
    } = updates;
    console.log(updates.company);

    /*if (roleName) {
      const roleId = await this.getRoleIdByName(roleName);
    } else {
      roleId = 2;
    }
    //const roleId = await this.getRoleIdByName(roleName);*/
    const roleId = 2;
    const query = `
      UPDATE users
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        rating = COALESCE($5, rating),
        image = COALESCE($6, image),
        location = COALESCE($7, location),
        password = COALESCE($8, password),
        role_id = COALESCE($9, role_id),
        entity_type = COALESCE($10, entity_type)
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

    const musicianUpdates = {};
    if (updates.experience) {
      musicianUpdates.experience = updates.experience;
    }

    if (Array.isArray(genres) && genres.length > 0) {
      const genreIds = genres.map((genre) => genre.genre_id);
      musicianUpdates.genres = genreIds;
    }

    if (Array.isArray(instruments) && instruments.length > 0) {
      const instrumentIds = instruments.map(
        (instrument) => instrument.instrument_id
      );
      musicianUpdates.instruments = instrumentIds;
    }
    try {
      const { rows } = await pool.query(query, values);
      const updatedUser = new User(rows[0]);
      if (updatedUser.entityType === "musician" && musicianUpdates) {
        const musician = await Musician.getMusicianByUserId(userId);
        if (musician) {
          await Musician.updateMusician(musician.musicianId, musicianUpdates);
        }
      }

      if (updatedUser.entityType === "organizer") {
        const organizer = await Organizer.getNiceOrganizerByUserId(userId);
        if (organizer) {
          await Organizer.updateOrganizer(organizer.organizer_id, {
            user_id: userId,
            company: company || organizer.company,
          });
        }
      }

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update user");
    }
  }

  static async deleteUser(userId) {
    try {
      /*const musician = await Musician.getMusicianByUserId(userId);
      if (musician) {
        const musicianId = musician.musician_id;

        // Видаляємо жанри музиканта
        const queryDeleteMusicianGenres =
          "DELETE FROM musician_genre WHERE musician_id = $1";
        await pool.query(queryDeleteMusicianGenres, [musicianId]);

        // Видаляємо інструменти музиканта
        const queryDeleteMusicianInstruments =
          "DELETE FROM musician_instrument WHERE musician_id = $1";
        await pool.query(queryDeleteMusicianInstruments, [musicianId]);

        // Видаляємо музиканта
        const queryDeleteMusician = "DELETE FROM musician WHERE user_id = $1";
        await pool.query(queryDeleteMusician, [userId]);

        console.log("Musician deleted successfully");
      }

      const organizer = await Organizer.getNiceOrganizerByUserId(userId);
      if (organizer) {
        const queryDeleteOrganizer =
          "DELETE FROM organizers WHERE user_id = $1";
        await pool.query(queryDeleteOrganizer, [userId]);
        console.log("Organizer deleted successfully");
      }*/

      const musician = await Musician.getMusicianByUserId(userId);
      if (musician) {
        const queryDeleteMusician = "DELETE FROM musician WHERE user_id = $1";
        await pool.query(queryDeleteMusician, [userId]);
      }
      const organizer = await Organizer.getNiceOrganizerByUserId(userId);
      if (organizer) {
        const queryDeleteOrganizer =
          "DELETE FROM organizers WHERE user_id = $1";
        await pool.query(queryDeleteOrganizer, [userId]);
        console.log("Organizer deleted successfully");
      }
      const queryDeleteUser = "DELETE FROM users WHERE user_id = $1";
      await pool.query(queryDeleteUser, [userId]);
      console.log("User deleted successfully");
    } catch (error) {
      console.log(error);
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

  static async getUserByLocation(location) {
    const query = "SELECT * FROM users WHERE location = $1";
    const values = [location];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new User(row));
    } catch (error) {
      throw new Error("Failed to get users by location");
    }
  }

  static async login(phone, password) {
    const query = `
      SELECT users.user_id AS id, roles.role_name, musician.musician_id, organizers.organizer_id
      FROM users
      JOIN roles ON users.role_id = roles.role_id
      LEFT JOIN musician ON users.user_id = musician.user_id
      LEFT JOIN organizers ON users.user_id = organizers.user_id
      WHERE users.phone = $1 AND users.password = $2
    `;
    const values = [phone, password];

    try {
      const { rows } = await pool.query(query, values);
      if (rows.length === 1) {
        const { id, role_name, musician_id, organizer_id } = rows[0];

        console.log(rows[0]);
        if (role_name == "admin") {
          return { id, role_name };
        } else if (musician_id) {
          return { id, role_name, musician_id };
        } else if (organizer_id) {
          return { id, role_name, organizer_id };
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to log in");
    }
  }
}

module.exports = User;
