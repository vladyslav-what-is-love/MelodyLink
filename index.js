const express = require("express");

const app = express();

app.use(express.json());

const port = 3000;

// Підключення до бази даних
const pool = require("./db");

// Реєстрація маршрутів
const genreRouter = require("./routes/genreRouter");
const instrumentRouter = require("./routes/instrumentRouter");
app.use("/genres", genreRouter);
app.use("/instruments", instrumentRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
