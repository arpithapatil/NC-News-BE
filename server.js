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

app.use((err, req, res) => {
  if (err.type === 404) return res.status(404).send({ msg: 'page not found' });
  res.status(500).send(err);
});


app.use('*', (req, res) => {
  res.status(404).send({
    msg: 'page not found'
  });
});

module.exports = app;