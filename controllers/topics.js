const Topics = require('../models/topics');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/northcoders-news-api', { useMongoClient: true });
mongoose.Promise = Promise;


const getAllTopics = (req, res, next) => {
  return Topics
    .find()
    .then(topics => {
      console.log(topics);
      res.status(200).send({topics});
    })
    .catch(err => next(err));
};


module.exports = {getAllTopics};