const { Pool } = require("pg");

const pool = new Pool({
  user: "music_admin",
  password: "music_admin",
  host: "localhost",
  port: "5432",
  database: "music_search",
});

/*async function testDatabaseConnection() {
  try {
    // Виконання запиту для перевірки з'єднання
    const client = await pool.connect();
    console.log("Connected to the database!");
    client.release(); // Закриття підключення
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    // Закриття пула підключень
    pool.end();
  }
}

// Виклик функції перевірки з'єднання
testDatabaseConnection();*/

module.exports = pool;
