const {Comments} = require('../models');

const voteCommentById = (req, res, next) => {
  const upOrDown = req.query.vote;
  const vote = updateVoteCount(upOrDown);
  Comments.findOneAndUpdate({_id: req.params.comment_id}, { $inc: { votes: vote } }, { new: true })
    .then((comment) => {
      if (comment.length === 0) return next({status: 404});
      if (!req.body.article) res.send(comment);
      else {
        Comments.find({belongs_to: req.body.article_id})
          .then((comments) => {
            console.log(comments);
            res.send(comments);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') return next({status: 400, message: 'Invalid comment ID'});
      next(err);
    });
};

function updateVoteCount (vote) {
  if (vote === 'up') return 1;
  else if (vote === 'down') return -1;
}

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