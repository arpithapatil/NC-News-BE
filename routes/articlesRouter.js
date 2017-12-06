const router = require('express').Router(); 
const {getAllArticles,getCommentsByArticle,postCommentsByArticleId,voteArticleByArticleId} = require('../controllers');

router.get('/', getAllArticles); 
router.get('/:article_id/comments', getCommentsByArticle);
router.post('/:article_id/comments', postCommentsByArticleId);
router.put('/:article_id', voteArticleByArticleId);

module.exports = router;