const {Users} = require('../models/models');

const getUserByUsername = (req, res, next) => {
  Users.findOne({username: req.params.username})
    .then(user => {
      if (!user) return next({status: 404, message: 'Username does not match any user'});
      res.status(200).send({user});
    })
    .catch(error => next(error));
};


module.exports = {getUserByUsername};