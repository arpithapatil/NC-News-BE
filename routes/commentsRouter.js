const router = require('express').Router(); 
const {voteCommentByCommentId} = require('../controllers');


router.put('/:comment_id', voteCommentByCommentId);

module.exports = router;