const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const checkValidId = (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid Uuid Id!" });
  }
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "Repository not found!" });
  }
  request.body.index = index;
  return next();
};

app.use('/repositories/:id', checkValidId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { index } = request.body;
  const { title, url, techs } = request.body;
  const repository = {...repositories[index], title, url, techs};
  repositories[index] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { index } = request.body;
  repositories.splice(index, 1);
  return response.status(204).json({success: "Repository wiped out!"})
});

app.post("/repositories/:id/like", (request, response) => {
  const { index } = request.body;
  repositories[index].likes++;
  return response.json(repositories[index]);
});

module.exports = app;
