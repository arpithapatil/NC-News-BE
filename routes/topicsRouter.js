const router = require('express').Router(); 
const {getAllTopics} = require('../controllers/topics');

router.get('/', getAllTopics);



module.exports = router;