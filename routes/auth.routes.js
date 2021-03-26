const router = require('express').Router();
const UserModel = require('../models/user.model');
const UserController = require('../controllers/UserController');
const { authValidationRules } = require('../validation');
const { validator } = require('../middlewares');

const userController = new UserController(UserModel);

router.post('/', authValidationRules(), validator, (req, res, next) =>
  userController.authenticate(req, res, next)
);

module.exports = router;
