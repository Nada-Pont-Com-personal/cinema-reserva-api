import express from "express";
import { openDb } from "./banco.js";
import bcryptjs from "bcryptjs";
const router = express.Router();

function saveSessao(req) {
  return new Promise((res, rej) => {
    req.session.save(function (err) {
      if (err) return rej(err);

      res();
    });
  });
}

async function regenSessao(req, id, email, nome) {
  await new Promise((res, rej) => {
    req.session.regenerate(function (err) {
      if (err) return rej(err);

      req.session.user = { id, email, nome };

      res();
    });
  });
  await saveSessao(req);
}

router.post("/sair", async function sair(req, res) {
  try {
    await new Promise((res, ref) => {
      //remove o id do usuario da sessão
      req.session.user = undefined;

      req.session.save(function (err) {
        if (err) return ref(err);
        req.session.regenerate(function (err) {
          if (err) return ref(err);
          res();
        });
      });
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/entrar", async (req, res, next) => {
  const con = await openDb();
  try {
    console.log(req.body);
    const { email, senha } = req.body;
    const row = await con.get("SELECT * from usuario WHERE email=?", [email]);

    if (row == undefined) return res.json({ ok: false });

    const { senha: s, id, nome } = row;

    const valida = bcryptjs.compareSync(senha, s);

    if (valida) {
      await regenSessao(req, id, email, nome);

      console.log(req.session.user);

      await con.close();

      res.json({ ok: true, user: { id, email, nome } });
    } else {
      res.json({ ok: false });
    }
  } catch (e) {
    console.log(e);
    con.close();
    res.sendStatus(500);
  }
});

router.post("/cadastro", async (req, res, next) => {
  const con = await openDb();
  try {
    console.log(req.body);
    const { nome, email, senha } = req.body;
    const rows = await con.all("SELECT * from usuario WHERE email=?", [email]);

    if (rows.length != 0) return res.json({ ok: false, email: true });

    const senhaCry = bcryptjs.hashSync(senha, 4);
    const result = await con.run(
      "INSERT INTO usuario (nome,email,senha) values (?,?,?);",
      [nome, email, senhaCry]
    );
    const id = result.lastID;

    await regenSessao(req, id, email, nome);

    con.close();

    res.json({ ok: true, user: { id, email, nome } });
  } catch (e) {
    console.log(e);
    con.close();
    res.sendStatus(500);
  }
});

router.get("/sessao", (req, res) => {
  console.log("sessao", req.session.user);
  res.json(req.session.user);
});

export default router;
