const Controller = require("./Controller");

class LocationController extends Controller {
  async getLocationGroup(req, res, next) {
    try {
      const typeGroup = await this.model.aggregate([
        {
          $group: {
            _id: "$district",
            data: {
              $push: {
                _id: "$_id",
                buildingName: "$buildingName",
                address: "$address",
                phone: "$phone",
                description: "$description",
              },
            },
          },
        },
      ]);

      res.status(200).json(typeGroup);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LocationController;
