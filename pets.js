#!/bin/bash

let fs = require("fs");
// console.log(fs);

// console.log("pets");
// console.log("hello");

let option = process.argv[2];
// if (option == "read") {
//   console.log("you slected read");
// }

switch (option) {
  case "read":
    let subCommand = process.argv[3];
    if (subCommand) {
      fs.readFile("pets.json", "utf8", (error, data) => {
        if (subCommand < 0 || subCommand > data[subCommand].length) {
          console.log("INDEX");
        } else {
          let pets = JSON.parse(data);
          console.log(pets[subCommand]);
        }
      });
    } else {
      fs.readFile("pets.json", "utf8", (error, data) => {
        let pets = JSON.parse(data);
        console.log(pets);
      });
      //   console.log("selected read");
    }

    break;

  case "create":
    console.log("selected create");
    let age = process.argv[3];
    let kind = process.argv[4];
    let name = process.argv[5];

    fs.readFile("pets.json", "utf8", (error, data) => {
      let pets = JSON.parse(data);
      let addPets = { age: age, kind: kind, name: name };
      pets.push(addPets);
      fs.writeFile("pets.json", JSON.stringify(pets), () => {
        console.log(addPets);
      });
    });
    break;

  case "update":
    console.log("selected update");
    let index = process.argv[3];
    let newAge = process.argv[4];
    let newKind = process.argv[5];
    let newName = process.argv[6];
    // console.log(process.argv[3]);
    if (index) {
      fs.readFile("pets.json", "utf8", (error, data) => {
        if (index < 0 || index < data[index].length) {
          console.log("INDEX");
        } else {
          fs.readFile("pets.json", "utf8", (error, data) => {
            let pets = JSON.parse(data);
            let updatePets = { age: newAge, kind: newKind, name: newName };
            pets[index].age = newAge;
            pets[index].kind = newKind;
            pets[index].name = newName;

            fs.writeFile("pets.json", JSON.stringify(pets), () => {
              pets.push(updatePets);
              console.log(updatePets);
            });
          });
        }
      });
      break;
    }
  case "destroy":
    console.log("selected destroy");
    let dIndex = process.argv[3];
    console.log(dIndex);
    // console.log(process.argv[3]);
    if (dIndex) {
      fs.readFile("pets.json", "utf8", (error, data) => {
        if (dIndex < 0 || dIndex > data[dIndex]) {
          console.log("INDEX");
        } else {
          fs.readFile("pets.json", "utf8", (error, data) => {
            let pets = JSON.parse(data);

            delete pets[dIndex];

            fs.writeFile("pets.json", JSON.stringify(pets), () => {
              //   console.log(updatePets);
            });
          });
        }
      });
    }

    break;

  default:
    console.error(`useage: node pets.js [read|create|update|destroy]`);
    process.exit(0);
}
