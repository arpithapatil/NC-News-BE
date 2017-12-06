const {Topics, Articles, Comments, Users} = require('../models/models');

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

const getCommentsByArticleId = (req, res, next) => {
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


const postCommentsByArticleId = (req, res, next) => {
  new Comments({body:req.body.body, belongs_to: req.params.article_id, created_by: 'northcoders'})
    .save()
    .then((comment) => {
      console.log(comment,'****');
      return Comments.find({ belongs_to: comment.belongs_to });
    })
    .then((comments) => {
      console.log(comments);
      res.status(201).send(comments);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next({ err, type: 400 });            
      next(err);
    });
};

const voteArticleByArticleId = (req, res, next) => {
  let increment = 0;
  if (req.query.vote === 'up') increment++;
  if (req.query.vote === 'down') increment--;
  return Articles.findByIdAndUpdate(req.params.article_id, { $inc: { votes: increment } }, { new: true })
    .then(vote => {
      res.send({vote}); 
    })
    .catch(err => next(err));    
};

const voteCommentByCommentId = (req, res, next) => {
  let increment = 0;
  if (req.query.vote === 'up') increment++;
  if (req.query.vote === 'down') increment--;
  return Comments.findByIdAndUpdate(req.params.comment_id, { $inc: { votes: increment } }, { new: true })
    .then((comment) => {
      res.send({comment});
    })
    .catch(err => {
      next(err);
    });
};

const deleteCommentByCommentId = (req, res, next) => {
  return Comments.findByIdAndRemove(req.params.comment_id)
    .then((comment) =>
      res.status(202).send({ comment_deleted: comment, message: 'deleted' }))
    .catch(err => {
      if (err.name === 'CastError') return next({ err, type: 404 });            
      next(err);
    });
};

const getProfileDataByUsername = (req, res, next) => {
  return Users.find({ username: req.params.username })
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      next(err);
    });
};
module.exports = {getAllTopics, getArticlesByTopic,getAllArticles,getCommentsByArticleId,postCommentsByArticleId,voteArticleByArticleId,voteCommentByCommentId,deleteCommentByCommentId,getProfileDataByUsername};
    