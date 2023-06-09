const { Pool } = require("pg");

const pool = new Pool({
  user: "music_admin",
  password: "music_admin",
  host: "localhost",
  port: "5432",
  database: "music_search",
});

module.exports = pool;

/*
  //Для створення напряму

  async function testDatabaseConnection() {
  try {
    // Підключення до бази даних
    await pool.connect();
    console.log("Connected to the database");

    // Створення жанру
    const genre = "Rock"; // Назва жанру, який ви хочете створити
    const query = `
      INSERT INTO genre (genre)
      VALUES ($1)
      RETURNING *
    `;
    const values = [genre];

    const result = await pool.query(query, values);
    console.log("Genre created:", result.rows[0]);
  } catch (error) {
    console.error("Failed to connect to the database or create genre:", error);
  } finally {
    // Завершення підключення до бази даних
    pool.end();
    console.log("Database connection closed");
  }
}

// Виклик функції для перевірки підключення та створення жанру

testDatabaseConnection();*/
//pool.end();
