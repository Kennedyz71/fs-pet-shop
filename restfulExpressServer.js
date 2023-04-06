const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const fs = require("fs");
const { Client } = require("pg");
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(express.json());
dotenv.config();
const client = new Client(process.env.DATABASE_URL);
client.connect();
// console.log(client);

// let pets = JSON.parse(petsJSON);
let petsData = [];

app.get("/", (req, res) => {
  console.log("hello world");
});

app.get("/pets", (req, res) => {
  // console.log("pets_route");
  client.query("SELECT * FROM pet").then((results) => {
    res.send(results.rows);
  });
});

app.get("/pets/:id", (req, res) => {
  const petId = req.params.id;
  client.query("SELECT * FROM pet WHERE id = $1", [petId]).then((result) => {
    if (result.rows.length === 0) {
      res.status(404).send("pet id not found");
    } else {
      res.send(result.rows[0]);
    }
  });
});

app.post("/pets", (req, res) => {
  const { name, age, kind } = req.body;
  if (!name || !age || !kind || isNaN(age)) {
    res.status(400).send("Bad Request");
  } else {
    const query = {
      text: "INSERT INTO pet (name, age, kind) VALUES ($1, $2, $3) RETURNING id",
      values: [name, age, kind],
    };
    client
      .query(query)
      .then((result) => {
        const newPet = {
          id: result.rows[0].id,
          name: name,
          age: age,
          kind: kind,
        };
        res.status(201).json(newPet);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Server Error");
      });
  }
});

app.put("/pets/:id", (req, res) => {
  let id = req.params.id;
  let { name, age, kind } = req.body;

  client.query(
    "UPDATE pet SET name = $1, age = $2, kind = $3 WHERE id = $4",
    [name, age, kind, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Pet modified with ID: ${id}`);
    }
  );
});

app.patch("/pets/:id", (req, res) => {
  let key = Object.keys(req.body)[0];
  let value = Object.values(req.body)[0];
  client
    .query(`UPDATE pet SET ${key} = $1 WHERE id = $2 RETURNING *`, [
      value,
      req.params.id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).send("pets not found");
      } else {
        res.status(200).send(result.rows[0]);
      }
    });
});

app.delete("/pets/:id", (req, res) => {
  client
    .query("DELETE FROM pet WHERE id = $1", [req.params.id])
    .then(() => res.send(`Pet with id ${req.params.id} deleted successfully`))
    .catch((err) => res.status(500).send(err.message));
});

app.listen(port, () => {
  console.log(`restfulServer is listening on port:${port}`);
});
