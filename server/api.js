const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/assets/:address", function (req, res) {
  res.send({
    assets: [
      {
        contract_address: "0x9270f32d0e7e50211b068ebfb17e425f8ddbb100",
        token_id: 291,
        name: "Kirby is a small, pink, spherical creature who has the ability to inhale objects and creatures to gain their powers. He is often called upon to save his home world of Dream Land from various villains.",
        description: null,
        external_link: null,
        image_url: null,
        animation_url: null,
        model_url: null,
        properties: [],
      },
      {
        contract_address: "0x503cb51f9b781a3f1548e1a838d606550d596e6f",
        token_id: 291,
        name: "SF Light - Fighter 291",
        description: null,
        external_link: null,
        image_url: null,
        animation_url: null,
        model_url: null,
        properties: [],
      },
      {
        contract_address: "0x9270f32d0e7e50211b068ebfb17e425f8ddbb100",
        token_id: 9394,
        name: "Ultra Motorbikes - 9394",
        description: null,
        external_link: null,
        image_url: null,
        animation_url: null,
        model_url: null,
        properties: [],
      },
      {
        contract_address: "0x503cb51f9b781a3f1548e1a838d606550d596e6f",
        token_id: 291,
        name: "Star Wars - X Wing Starfighter 3",
        description: null,
        external_link: null,
        image_url: null,
        animation_url: null,
        model_url: null,
        properties: [],
      },
    ],
  });
});

app.listen(3300);
