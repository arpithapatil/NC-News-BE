const {Topics, Articles} = require('../models/models');

const getAllTopics = (req, res, next) => {
  return Topics
    .find()
    .then(topics => {
      res.status(200).send({topics});
    })
    .catch(err => next(err));
};

const getArticlesByTopic = (req, res, next) => {
  return Articles 
    .find({belongs_to: req.params.topic})
    .then(articles => {
      res.status(200).send({articles});
    })
    .catch(err => next(err));

};

const getAllArticles = (req, res, next) => {
  return Articles
    .find()
    .then(articles => {
      res.status(200).send({articles});
    })
    .catch(err => next(err));
};

module.exports = {getAllTopics, getArticlesByTopic,getAllArticles};
    