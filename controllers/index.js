const {Topics, Articles, Comments} = require('../models/models');

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
    .find({belongs_to: req.params.topic_id})
    .then(articles => {
      if (articles.length === 0) return next({type: 404, msg: 'page not found'});
      res.status(200).send({articles});
    })
    .catch(err => next(err));

};

const getAllArticles = (req, res, next) => {
  return Articles
    .find()
    .then(articles => {
      console.log(articles);
      res.status(200).send({articles});
    })
    .catch(err => next(err));
};

const getCommentsByArticle = (req, res, next) => {
  return Comments
    .find({belongs_to: req.params.article_id})
    .then(comments => {
      console.log(comments);
      res.status(200).send({comments});
    })
    .catch(err => {
      if (err.name === 'CastError') return next({ err, type: 404 });            
      next(err);
    });
};


module.exports = {getAllTopics, getArticlesByTopic,getAllArticles,getCommentsByArticle};
    