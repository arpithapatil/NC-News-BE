const {Topics, Articles, Comments} = require('../models');


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
      Promise.all(getCommentCount(articles))
        .then((commentCount) => {
          const updatedArticles = addCommentCount(articles, commentCount);
          res.status(200).send(updatedArticles);
        });
    })
    .catch(error => {
      if (error.name === 'CastError') next({ status: 400, message: 'Topic not found' });
      next(error);
    });
};
function getCommentCount (arr) {
  return arr.map((article) => {
    return Comments.count({belongs_to: article._id});
  });
}
function addCommentCount (arr, count) {
  return arr.map((article, i) => {
    article = article.toObject();
    article.comments = count[i];
    return article;
  });
}


module.exports = {getAllTopics, getArticlesByTopic};