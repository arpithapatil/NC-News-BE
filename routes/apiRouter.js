const router = require('express').Router(); 
const topicsRouter = require('./topicsRouter'); 
const articlesRouter = require('./articlesRouter'); 
const commentsRouter = require('./commentsRouter'); 
const usersRouter = require('./usersRouter'); 


router.use('/topics', topicsRouter); 
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);




module.exports = router;