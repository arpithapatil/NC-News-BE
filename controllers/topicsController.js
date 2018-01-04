const {Topics, Articles} = require('../models');


const getAllTopics = (req, res, next) => {
  Topics.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(error => next(error));
};

const getArticlesByTopic = (req, res, next) => {
  Articles.find({ belongs_to: req.params.topic_id })
    .then(articles => {
      if (articles.length === 0) return next({ status: 404, message: 'Topic not found' });
      res.status(200).send({ articles });
    })
    .catch(error => {
      if (error.name === 'CastError') next({ status: 400, message: 'Topic not found' });
      next(error);
    });
};



module.exports = {getAllTopics, getArticlesByTopic};