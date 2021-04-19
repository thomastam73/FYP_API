const Controller = require("./Controller");

class SignLanguageController extends Controller {
  async getSignLanguageGroup(req, res, next) {
    try {
      const typeGroup = await this.model.aggregate([
        {
          $group: {
            _id: "$district",
            data: {
              $push: {
                _id: "$_id",
                name: "$name",
                videoLink: "$videoLink",
                description: "$description",
                gesture: "$gesture",
                imgURL: "$imgURL",
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

module.exports = SignLanguageController;
