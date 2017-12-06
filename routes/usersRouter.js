const router = require('express').Router(); 
const {getProfileDataByUsername} = require('../controllers');
 
router.get('/:username', getProfileDataByUsername);

module.exports = router;