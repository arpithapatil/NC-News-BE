const router = require('express').Router(); 
const {getAllArticles,getCommentsByArticleId,postCommentsByArticleId,voteArticleByArticleId} = require('../controllers');

router.get('/', getAllArticles); 
router.get('/:article_id/comments', getCommentsByArticleId);
router.post('/:article_id/comments', postCommentsByArticleId);
router.put('/:article_id', voteArticleByArticleId);

module.exports = router;