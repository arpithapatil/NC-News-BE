const {Comments} = require('../models');

const voteCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const query = req.query.vote;
  let increment;

  if (query === 'up') increment = 1;
  else if (query === 'down') increment = -1;

  Comments.findByIdAndUpdate(comment_id, { $inc: { votes: increment } }, { new: true })
    .then(comment => {
      res.send({ comment });
    })
    .catch(error => {
      if (error.name === 'CastError') return next({ status: 400, message: 'Comment not found' });
      next(error);
    });
};

const deleteCommentById = (req, res, next) => {
  Comments.findByIdAndRemove(req.params.comment_id)
    .then(() => {
      Comments.find({belongs_to: req.query.article_id})
        .then((comments) => {
          res.send(comments);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next({status: 400, message: 'Comment not found'});
      next(err);
    });
};


module.exports = {voteCommentById, deleteCommentById};