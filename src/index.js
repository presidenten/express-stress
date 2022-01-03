const express = require('express');
const app = express();
const config = require('./config.js');
const stress = require('./stress.js');

app.get('/cpu/:load?', ({ params }, res) => {
  const result = stress.stress_cpu_with_load(params.load);
  console.log(result.message);
  res.status(result.status).send(result.message)
});

app.get('/memory/:load?', ({ params }, res) => {
  const result = stress.stress_memory_with_load(params.load);
  console.log(result.message);
  res.status(result.status).send(result.message)
});

const server = app.listen(config.port, () => {
  console.log(`Stress app listening at http://localhost:${config.port}`);
});

const exit = () => {
  console.info('Shutting down...');
  stress.shutDown();
  server.close(err => process.exit(err ? 1 : 0));
}

process.on('SIGINT', exit);

process.on('SIGTERM', exit);
