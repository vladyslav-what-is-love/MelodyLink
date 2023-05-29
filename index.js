const express = require("express");
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = 3000;

// Підключення до бази даних
const pool = require("./db");

// Реєстрація маршруті
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
app.use("/cooperationrequests", cooperationRequestRouter);

/*app.post("/instruments", (req, res) => {
  let data = req.body;
  console.log(data);
  res.send("Data Received: " + JSON.stringify(data));
});

app.post("/fuck", function (req, res) {
  console.log(req.body); // populated!
  res.send(200, req.body);
});*/

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
