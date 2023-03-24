"use strict";

var fs = require("fs");
var path = require("path");
var petsPath = path.join(__dirname, "pets.json");

var http = require("http");
var port = process.env.PORT || 8000;

var server = http.createServer(function (req, res) {
  if (req.method === "GET" && req.url === "/pets") {
    fs.readFile(petsPath, "utf8", function (err, petsJSON) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      //   res.setHeader("Content-Type", "application/json");
      res.end(petsJSON);
    });
  } else if (req.method === "GET" && req.url === "/pets/0") {
    fs.readFile(petsPath, "utf8", function (err, petsJSON) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }

      var pets = JSON.parse(petsJSON);
      var petJSON = JSON.stringify(pets[0]);
      res.writeHead(200, { "Content-Type": "application/json" });
      //   res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    });
  } else if (req.method === "GET" && req.url === "/pets/1") {
    fs.readFile(petsPath, "utf8", function (err, petsJSON) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }

      var pets = JSON.parse(petsJSON);
      var petJSON = JSON.stringify(pets[1]);
      res.writeHead(200, { "Content-Type": "application/json" });
      //   res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    });
  } else if (
    req.method === "GET" &&
    req.url === "/pets/`${petsJSON[i].length}`"
  ) {
    fs.readFile(petsPath, "utf8", function (err, petsJSON) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        return res.end("Internal Server Error");
      }

      var pets = JSON.parse(petsJSON);
      var petJSON = JSON.stringify(pets[1]);
      res.writeHead(200, { "Content-Type": "application/json" });
      //   res.setHeader("Content-Type", "application/json");
      res.end(petJSON);
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not found");
  }
  //   if (req.method === "POST" && req.url === "/pets") {
  //     console.log("post");
  //     if (err) {
  //       console.error(err.stack);
  //       res.statusCode = 500;
  //       res.setHeader("Content-Type", "text/plain");
  //       return res.end("Internal Server Error");
  //     }else {
  //         let age = process.argv[3];
  //         let kind = process.argv[4];
  //         let name = process.argv[5];
  //         fs.readFile("pets.json", "utf8", (error, data) => {
  //          let pets = JSON.parse(data);
  //          let addPets = { age: age, kind: kind, name: name };
  //         pets.push(addPets);
  //         res.writeHead(200, { "Content-Type": "application/json" });
  //           fs.writeFile("pets.json", JSON.stringify(pets), () => {
  //             console.log(addPets);
  //          res.end(petsJSON);
  //          })
  //         });
  //      });
  //     }

  //   res.setHeader("Content-Type", "application/json");
});

server.listen(port, function () {
  console.log("Listening on port", port);
});
