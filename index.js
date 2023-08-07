const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    }
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  }),
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send(`<h1>Phonebook Backend </h1>
    <div>go to /api/persons</div>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people</div>
    <p>${new Date()}</p>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    console.log("Status: 404");
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const deletedId = Number(request.params.id);
  persons = persons.filter((person) => person.id !== deletedId);

  response.status(204).end();
});

const checkSameName = (personName) => {
  return persons.some((person) => person.name === personName);
};

app.post("/api/persons", (request, response) => {
  const newId = Math.round(Math.random() * 1000);
  const requestBody = request.body;

  if (!requestBody.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!requestBody.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  if (checkSameName(requestBody.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: newId,
    name: requestBody.name,
    number: requestBody.number,
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
