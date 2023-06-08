const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");

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

/*app.use(express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  "/frontend-controllers",
  express.static(path.join(__dirname, "frontend-controllers"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
*/
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

/*app.post("/instruments", (req, res) => {
  let data = req.body;
  console.log(data);
  res.send("Data Received: " + JSON.stringify(data));
});
const port = 5450;

app.post("/fuck", function (req, res) {
  console.log(req.body); // populated!
  res.send(200, req.body);
});*/

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
