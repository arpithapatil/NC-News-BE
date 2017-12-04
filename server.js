const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;

mongoose.Promise = Promise;

mongoose.connect(db, { useMongoClient: true })
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));


app.use(bodyParser.json()); 



module.exports = app; 