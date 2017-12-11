const router = require('express').Router(); 
const {getUserByUsername} = require('../controllers/usersController');
 
router.get('/:username', getUserByUsername);

module.exports = router;