const router = require('express').Router(); 
const {getAllArticles,getCommentsByArticle} = require('../controllers');

router.get('/', getAllArticles); 
router.get('/:article_id/comments', getCommentsByArticle);

module.exports = router;