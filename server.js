import express from "express";
import session from "express-session";

const port = process.env.port || 5000;

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.get("/", (req, res, next) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
