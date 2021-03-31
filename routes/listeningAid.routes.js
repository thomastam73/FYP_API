const router = require("express").Router();
const ListeningAidModel = require("../models/listeningAid.model");
const ListeningAidController = require("../controllers/ListeningAidController");
const { authentication } = require("../middlewares");

const listeningAidController = new ListeningAidController(ListeningAidModel);

router.get("/", (req, res, next) =>
  listeningAidController.getAllEntities(req, res, next)
);
router.get("/group", (req, res, next) =>
  listeningAidController.getListeningAidGroup(req, res, next)
);
router.get("/:id", (req, res, next) =>
  listeningAidController.getEntityById(req, res, next)
);
router.post("/", authentication, (req, res, next) =>
  listeningAidController.createEntity(req, res, next)
);
router.put("/:id", authentication, (req, res, next) =>
  listeningAidController.updateEntityById(req, res, next)
);
router.delete("/:id", authentication, (req, res, next) =>
  listeningAidController.deleteEntityById(req, res, next)
);

module.exports = router;
