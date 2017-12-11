if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const apiRouter = require('./routes/apiRouter');
const cors = require('cors');

mongoose.Promise = Promise;

mongoose.connect(db, {useMongoClient: true})
  .then(() => console.log('connected to database'))
  .catch(error => console.log('connection failed', error));

app.use(cors());
app.use(bodyParser.json());
app.use('/',express.static('public'));
app.use('/api', apiRouter);

app.use((error, req, res, next) => {
  if(error.status === 404) return res.status(404).send({message: error.message});
  if(error.status === 400) return res.status(400).send({message: error.message});
  else return next(error);
});
app.use('/*', (req, res) => {
  res.status(404).send({message: 'Page not found'});
});

app.use((error, req, res) => {
  res.status(500).send({error});
});
module.exports = app;