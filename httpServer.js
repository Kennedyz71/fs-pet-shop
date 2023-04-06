const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var fs = require("fs");
const http = require("http");
var path = require("path");
var petsPath = path.join(__dirname, "pets.json");

app.get("/", (req, res) => {
  res.send("what are you looking for?");
});

app.get("/pets", (req, res) => {
  fs.readFile(petsPath, "utf8", function (err, petsJSON) {
    let pets = JSON.parse(petsJSON);
    if (err) {
      console.error(err.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Internal Server Error");
    }
    // res.writeHead(200, { "Content-Type": "application/json" });
    res.send(pets);
    //   res.setHeader("Content-Type", "application/json");
    res.end();
  });
});

app.get("/pets/:petIndex", (req, res) => {
  fs.readFile(petsPath, "utf8", function (err, petsJSON) {
    let pets = JSON.parse(petsJSON);
    let index = pets[req.params.petIndex];

    if (err) {
      // console.error(err.stack);
      res.statusCode = 500;
      res.end();
    } else if (!index) {
      res.statusCode = 404;
      res.end("Not found");
    } else {
      res.send(index);
      res.status(200);
      res.end();
    }
  });
});

app.post("/pets", (req, res) => {
  console.log(req.body);
  console.log(req.body.age);
  let age = req.body.age;
  let kind = req.body.kind;
  let name = req.body.name;
  console.log(age);
  console.log(kind);
  console.log(name);
  // const { age, kind, name } = req.body;
  // console.log(age, kind, name);
  fs.readFile(petsPath, "utf8", (error, petsJSON) => {
    if (error) {
      res.statusCode = 500;
      res.end();
    }
    // let age = JSON.stringify(JSON.parse(req.body)).match("age");
    // let kind = JSON.stringify(JSON.parse(req.body)).match("kind");
    // let name = JSON.stringify(JSON.parse(req.body)).match("name");

    fs.readFile(petsPath, "utf8", (error, petsJSON) => {
      let pets = JSON.parse(petsJSON);
      let addPets = { age: age, kind: kind, name: name };
      pets.push(addPets);
      fs.writeFile(petsPath, JSON.stringify(pets), () => {
        console.log(addPets);
        res.end(petsJSON);
      });
    });
  });
});

app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});

// "use strict";

// var fs = require("fs");
// var path = require("path");
// var petsPath = path.join(__dirname, "pets.json");
// const express = require("express");

// var http = require("http");
// var port = process.env.PORT || 8000;

//
//   } else {
//     res.statusCode = 404;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Not found");
//   }
//   //   if (req.method === "POST" && req.url === "/pets") {
//   //     console.log("post");
//   //     if (err) {
//   //       console.error(err.stack);
//   //       res.statusCode = 500;
//   //       res.setHeader("Content-Type", "text/plain");
//   //       return res.end("Internal Server Error");
//   //     }else {
//   //         let age = process.argv[3];
//   //         let kind = process.argv[4];
//   //         let name = process.argv[5];
//   //         fs.readFile("pets.json", "utf8", (error, data) => {
//   //          let pets = JSON.parse(data);
//   //          let addPets = { age: age, kind: kind, name: name };
//   //         pets.push(addPets);
//   //         res.writeHead(200, { "Content-Type": "application/json" });
//   //           fs.writeFile("pets.json", JSON.stringify(pets), () => {
//   //             console.log(addPets);
//   //          res.end(petsJSON);
//   //          })
//   //         });
//   //      });
//   //     }

//   //   res.setHeader("Content-Type", "application/json");
// });

// server.listen(port, function () {
//   console.log("Listening on port", port);
// });
