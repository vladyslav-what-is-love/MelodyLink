const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `http://localhost:3000`);
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Підключення до бази даних
const pool = require("./db");

// Реєстрація маршруті
const genreRouter = require("./routes/genreRouter");
const instrumentRouter = require("./routes/instrumentRouter");
const organizerRouter = require("./routes/organizerRouter");
const musicianRouter = require("./routes/musicianRouter");
const userRouter = require("./routes/userRouter");
const cooperationRequestRouter = require("./routes/cooperationRequestRouter");
const loginRouter = require("./routes/loginRouter");

app.use("/genres", genreRouter);
app.use("/instruments", instrumentRouter);
app.use("/organizers", organizerRouter);
app.use("/musicians", musicianRouter);
app.use("/users", userRouter);
app.use("/cooperationrequests", cooperationRequestRouter);
app.use("/login", loginRouter);

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const port = 5440;

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
