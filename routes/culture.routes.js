const router = require('express').Router();
const CultureModel = require('../models/culture.model');
const CultureController = require('../controllers/CultureController');
const { authentication } = require('../middlewares');

const cultureController = new CultureController(CultureModel);

router.get('/', (req, res, next) =>
  cultureController.getAllEntities(req, res, next)
);
router.get('/group', (req, res, next) =>
  cultureController.getCultureGroup(req, res, next)
);
router.get('/:id', (req, res, next) =>
  cultureController.getEntityById(req, res, next)
);
router.post('/', authentication, (req, res, next) =>
  cultureController.createEntity(req, res, next)
);
router.put('/:id', authentication, (req, res, next) =>
  cultureController.updateEntityById(req, res, next)
);
router.delete('/:id', authentication, (req, res, next) =>
  cultureController.deleteEntityById(req, res, next)
);

module.exports = router;
