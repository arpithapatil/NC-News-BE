const {Articles,Comments} = require('../models');

const getAllArticles = (req, res, next) => {
  Articles.find()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(error => next(error));
};

const getArticlesById = (req, res, next) => {
  Articles.find({_id:req.params.article_id})
    .then(article => {
      if (article.length === 0) return next({ status: 404, message: 'Article not found' });
      res.status(200).send({article});
    })
    .catch(error => {
      if (error.name === 'CastError') next({ status: 400, message: 'Article not found' });
      next(error);
    
    });
};

const getCommentsByArticleId = (req, res, next) => {
  Comments.find({ belongs_to: req.params.article_id })
    .then(comments => {
      if (comments.length === 0) return next({ status: 404, message: 'Article not found' });
      res.status(200).send( comments );
    })
    .catch(error => {
      if (error.name === 'CastError') next({ status: 400, message: 'article_id not valid' });
      next(error);
    });
};

const postCommentsByArticleId = (req, res, next) => {
  if (req.body.comment === undefined) req.body.comment = 'new comment';
  if(/^\s*$/.test(req.body.comment)) return next({status: 400, message: 'Provide comment body'});
  
  let newComment = {
    body: req.body.comment,
    belongs_to: req.params.article_id,
    created_by: 'northcoder',
    votes: 0,
    created_at: Date.now()
  };
  Comments.create([newComment])
    .then(() => {
      return Comments.find({})
        .then((comments) => {
          res.send(comments);
        });
    })
    .catch((err) => {
      return next(err);
    });
};

const voteArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const query = req.query.vote;
  let increment;

  if (query === 'up') increment = 1;
  else if (query === 'down') increment = -1;

  Articles.findByIdAndUpdate(article_id, { $inc: { votes: increment } }, { new: true })
    .then(article => {
      res.send({ article });
    })
    .catch(error => {
      if (error.name === 'CastError') return next({ status: 400, message: 'Article not found' });
      next(error);
    });
};



module.exports = {getAllArticles, getArticlesById, getCommentsByArticleId, postCommentsByArticleId, voteArticleById};