const Controller = require("./Controller");

class ListeningAidController extends Controller {
  async getListeningAidGroup(req, res, next) {
    try {
      const typeGroup = await this.model.aggregate([
        {
          $group: {
            _id: "$type",
            data: {
              $push: {
                _id: "$_id",
                name: "$name",
                brand: "$brand",
                price: "$price",
                mark: "$mark",
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

module.exports = ListeningAidController;
