const router = require('express').Router(); 
const {getAllArticles,getCommentsByArticle,postCommentsByArticleId} = require('../controllers');

router.get('/', getAllArticles); 
router.get('/:article_id/comments', getCommentsByArticle);
router.post('/:article_id/comments', postCommentsByArticleId);

module.exports = router;