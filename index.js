const express = require("express");

const app = express();

app.use(express.json());

const port = 3000;

// Підключення до бази даних
const pool = require("./db");

// Реєстрація маршрутів
const genreRouter = require("./routes/genreRouter");
const instrumentRouter = require("./routes/instrumentRouter");
const organizerRouter = require("./routes/organizerRouter");
const musicianRouter = require("./routes/musicianRouter");
const userRouter = require("./routes/userRouter");
const cooperationRequestRouter = require("./routes/cooperationRequestRouter");

app.use("/genres", genreRouter);
app.use("/instruments", instrumentRouter);
app.use("/organizers", organizerRouter);
app.use("/musicians", musicianRouter);
app.use("/users", userRouter);
app.use("/cooperation-requests", cooperationRequestRouter);

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
