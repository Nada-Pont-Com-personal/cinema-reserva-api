import express from "express";

const port = process.env.port || 5000;

const app = express();

app.get("/", (req, res, next) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
