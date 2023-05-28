const express = require("express");
const app = express();
const port = 3000;

// Підключення до бази даних
const pool = require("../models/db");

// Реєстрація маршрутів
const userRouter = require("./routes/user");
const genreController = require("./controllers/genreController");
const organizerRouter = require("./routes/organizer");

app.use("/users", userRouter);
app.post("/genres", genreController.createGenre);
app.get("/genres/:genreId", genreController.getGenreById);
app.delete("/genres/:genreId", genreController.deleteGenre);
app.get("/genres", genreController.getAllGenres);
app.use("/organizers", organizerRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
