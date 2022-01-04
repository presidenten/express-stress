const express = require('express');
const app = express();
const config = require('./config.js');
const stress = require('./stress.js');

app.get('/cpu/:load?', ({ params }, res) => {
  const result = stress.stress_cpu_with_load(params.load);
  console.log(`host="${process.env.HOSTNAME}" msg="result.message"`);
  res.status(result.status).send(result.message)
});

app.get('/memory/:load?', ({ params }, res) => {
  const result = stress.stress_memory_with_load(params.load);
  console.log(`host="${process.env.HOSTNAME}" msg="result.message"`);
  res.status(result.status).send(result.message)
});

app.get('/clear-load', ({ params }, res) => {
  stress.clearLoad();
  const message = 'Cleared all load'
  console.log(`host="${process.env.HOSTNAME}" msg="message"`);
  res.status(200).send(message)
});

app.get('/health', (_, res) => {
  res.status(200).send('healthy');
});

const server = app.listen(config.port, () => {
  console.log(`host="${process.env.HOSTNAME}" msg="Stress app listening at http://localhost:${config.port}"`);
});

const exit = () => {
  console.info('Shutting down...');
  stress.clearLoad();
  server.close(err => process.exit(err ? 1 : 0));
}

process.on('SIGINT', exit);

process.on('SIGTERM', exit);
