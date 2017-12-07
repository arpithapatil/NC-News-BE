const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const cors = require('cors');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
mongoose.Promise = Promise;
const apiRouter = require('./routes/apiRouter');


mongoose.connect(db, {
  useMongoClient: true
})
  .then(() => console.log('successfully connected to the Database'))
  .catch(error => console.log('connection failed', error));



app.use(bodyParser.json());
app.use('/',express.static('public'));
app.use(cors());
app.use('/api', apiRouter);

app.use((error, req, res, next) => {
  if (error.type === 404) return res.status(404).send({ msg: 'page not found' });
  if (error.type === 400) return res.status(400).send({ msg: 'bad request' }); 
  else return next(error);
});
app.use((err, req, res) => {
  res.status(500).send({err});
});


app.use('/*', (req, res) => {
  res.status(404).send({
    msg: 'page not found'
  });
});

module.exports = app;