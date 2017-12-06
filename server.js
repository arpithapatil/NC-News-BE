const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
mongoose.Promise = Promise;
const apiRouter = require('./routes/apiRouter');


mongoose.connect(db, {
  useMongoClient: true
})
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));



app.use(bodyParser.json());


app.use('/api', apiRouter);

app.use((error, req, res, next) => {
  if (error.type === 404) return res.status(404).send({ msg: 'page not found' });
  if (error.type === 400) return res.status(400).send({ msg: 'bad request' }); 
  next;
  res.status(500).send(error);
});


app.use('*', (req, res) => {
  res.status(404).send({
    msg: 'page not found'
  });
});

module.exports = app;