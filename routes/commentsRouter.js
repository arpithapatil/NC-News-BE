const router = require('express').Router(); 
const {voteCommentById,deleteCommentById} = require('../controllers/commentsController');


router.put('/:comment_id', voteCommentById);
router.delete('/:comment_id', deleteCommentById);

module.exports = router;