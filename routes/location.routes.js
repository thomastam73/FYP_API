const router = require("express").Router();
const LocationModel = require("../models/location.model");
const LocationController = require("../controllers/LocationController");
const { authentication } = require("../middlewares");

const locationController = new LocationController(LocationModel);

router.get("/", (req, res, next) =>
  locationController.getAllEntities(req, res, next)
);
router.get("/group", (req, res, next) =>
  locationController.getLocationGroup(req, res, next)
);
router.get("/:id", (req, res, next) =>
  locationController.getEntityById(req, res, next)
);
router.post("/", authentication, (req, res, next) =>
  locationController.createEntity(req, res, next)
);
router.put("/:id", authentication, (req, res, next) =>
  locationController.updateEntityById(req, res, next)
);
router.delete("/:id", authentication, (req, res, next) =>
  locationController.deleteEntityById(req, res, next)
);

module.exports = router;
