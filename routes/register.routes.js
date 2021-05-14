const router = require("express").Router();
const UserModel = require("../models/user.model");
const UserController = require("../controllers/UserController");
const { userValidationRules } = require("../validation");
const { validator } = require("../middlewares");

const userController = new UserController(UserModel);

router.post("/", userValidationRules(), validator, (req, res, next) => {
  userController.createEntity(req, res, next);
});

module.exports = router;
