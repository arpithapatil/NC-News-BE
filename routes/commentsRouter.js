const router = require('express').Router(); 
const {voteCommentByCommentId,deleteCommentByCommentId} = require('../controllers');


router.put('/:comment_id', voteCommentByCommentId);
router.delete('/:comment_id', deleteCommentByCommentId);

module.exports = router;