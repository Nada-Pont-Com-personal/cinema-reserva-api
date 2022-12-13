import express from "express";
import session from "express-session";
import login from "./login.js";
import bodyParser from "body-parser";

const port = process.env.port || 5002;

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    // limit: "200kb",
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    name: "r",
    cookie: {
      // secure: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Adição aceitação dos headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Adição de acesso pela origin localHost
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  next();
});

app.use("/", login);

app.get("/", (req, res, next) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
