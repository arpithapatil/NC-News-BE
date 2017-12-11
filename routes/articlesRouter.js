const router = require('express').Router(); 
const {getAllArticles,getArticlesById,getCommentsByArticleId,postCommentsByArticleId,voteArticleById} = require('../controllers/articlesController');

router.get('/', getAllArticles); 
router.get('/:article_id', getArticlesById);
router.get('/:article_id/comments', getCommentsByArticleId);
router.post('/:article_id/comments', postCommentsByArticleId);
router.put('/:article_id', voteArticleById);

module.exports = router;