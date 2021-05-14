const router = require("express").Router();
const UserModel = require("../models/user.model");
const UserController = require("../controllers/UserController");
const { userValidationRules } = require("../validation");
const { validator, authentication } = require("../middlewares");

const userController = new UserController(UserModel);

router.get("/", authentication, (req, res, next) =>
  userController.getAllEntities(req, res, next)
);
router.get("/:id", authentication, (req, res, next) =>
  userController.getEntityById(req, res, next)
);
router.post(
  "/",
  authentication,
  userValidationRules(),
  validator,
  (req, res, next) => {
    userController.createEntity(req, res, next);
  }
);
router.put("/:id", authentication, (req, res, next) =>
  userController.updateEntityById(req, res, next)
);
router.delete("/:id", authentication, (req, res, next) =>
  userController.deleteEntityById(req, res, next)
);

module.exports = router;
