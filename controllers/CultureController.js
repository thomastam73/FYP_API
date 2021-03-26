const Controller = require('./Controller');

class CultureController extends Controller {
  async getCultureGroup(req, res, next) {
    try {
      const countryGroup = await this.model.aggregate([
        {
          $group: {
            _id: '$countrySource',
            data: {
              $push: {
                _id: '$_id',
                name: '$name',
                discription: '$discription',
                reportDate: '$reportDate',
              },
            },
          },
        },
      ]);

      res.status(200).json(countryGroup);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CultureController;
