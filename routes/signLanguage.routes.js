const router = require("express").Router();
const SignLanguageModel = require("../models/signLanguage.model");
const SignLanguageController = require("../controllers/SignLanguageController");
const { authentication } = require("../middlewares");

const signLanguageController = new SignLanguageController(SignLanguageModel);

router.get("/", (req, res, next) =>
  signLanguageController.getAllEntities(req, res, next)
);
router.get("/group", (req, res, next) =>
  signLanguageController.getSignLanguageGroup(req, res, next)
);
router.get("/:id", (req, res, next) =>
  signLanguageController.getEntityById(req, res, next)
);
router.post("/", authentication, (req, res, next) =>
  signLanguageController.createEntity(req, res, next)
);
router.put("/:id", authentication, (req, res, next) =>
  signLanguageController.updateEntityById(req, res, next)
);
router.delete("/:id", authentication, (req, res, next) =>
  signLanguageController.deleteEntityById(req, res, next)
);

module.exports = router;
