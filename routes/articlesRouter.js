const router = require('express').Router(); 
const {getAllArticles} = require('../controllers');

router.get('/', getAllArticles); 

module.exports = router;