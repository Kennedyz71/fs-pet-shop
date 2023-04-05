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

// app.post("/pets", (req, res) => {
//   const { name, age, kind } = req.body;
//   if (!name || !age || !kind || isNaN(age)) {
//     res.status(400).send("Bad Request");
//   } else {
//     let newPet = {
//       id: petsData.length + 1,
//       age: parseInt(age),
//       kind: kind,
//       name: name,
//     };
//     petsData.push(newPet);
//     res.status(200).json(newPet);
//   }
// });

// app.patch("/pets/:id", (req, res) => {
//   const petId = req.params.id;
//   const { name, age, kind } = req.body;

//   // Check if pet exists
//   client.query("SELECT * FROM pet WHERE id = $1", [petId]).then((result) => {
//     if (result.rows.length === 0) {
//       res.status(404).send("Pet not found");
//     } else {
//       const pet = result.rows[0];

//       // Check for bad request
//       if (
//         (age && isNaN(age)) ||
//         (kind && kind === "") ||
//         (name && name === "")
//       ) {
//         res.status(400).send("Bad Request");
//       } else {
//         // Update the pet
//         const updates = [];
//         if (name) {
//           pet.name = name;
//           updates.push(`name='${name}'`);
//         }
//         if (age) {
//           pet.age = parseInt(age);
//           updates.push(`age=${parseInt(age)}`);
//         }
//         if (kind) {
//           pet.kind = kind;
//           updates.push(`kind='${kind}'`);
//         }

//         // Save changes to the database
//         client
//           .query(`UPDATE pet SET ${updates.join(",")} WHERE id=$1`, [petId])
//           .then(() => {
//             res.status(200).json(pet);
//           });
//       }
//     }
//   });
// });

app.patch("/pets/:id", (req, res) => {
  let key = Object.keys(req.body)[0];
  let value = Object.values(req.body)[0];
  client
    .query(`UPDATE pet SET ${key} = $1 WHERE id = $2 RETURNING *`, [
      value,
      req.params.petId,
    ])
    .then((result) => {
      if (result.rows.length == 0) {
        res.status(404).send("pets not found");
      } else {
        res.send(result.rows);
      }
    });
});

// app.patch("/pets/:id", (req, res) => {
//   const pet = petsData.find((pet) => pet.id === parseInt(req.params.id));
//   if (!pet) {
//     res.status(404).send("Not Found");
//   } else {
//     const { name, age, kind } = req.body;

//     if ((age && isNaN(age)) || (kind && kind === "") || (name && name === "")) {
//       res.status(400).send("Bad Request");
//     } else {
//       if (name) {
//         pet.name = name;
//       }
//       if (age) {
//         pet.age = parseInt(age);
//       }
//       if (kind) {
//         pet.kind = kind;
//       }
//       res.status(200).json(pet);
//     }
//   }
// });
app.delete("/pets/:id", (req, res) => {
  const index = petsData.findIndex((pet) => pet.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send("Not Found");
  } else {
    petsData.splice(index, 1);
    res.status(200).json(pets);
  }
});

app.listen(port, () => {
  console.log(`RestfulServer is listening on port:${port}`);
});
