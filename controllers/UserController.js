const jwt = require("jsonwebtoken");

const Controller = require("./Controller");

class UserController extends Controller {
  async authenticate(req, res, next) {
    try {
      const user = await this.model.findOne({ email: req.body.email });
      // invalid email
      if (!user) {
        return res.status(403).json({
          status: "error",
          message: "Invalid email/password!!!",
          token: null,
        });
      }

      // invalid password
      if (req.body.password !== user.password) {
        return res.status(403).json({
          status: "error",
          message: "Invalid email/password!!!",
          token: null,
        });
      }

      const token = jwt.sign(
        {
          authUser: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
        "TFJ7bQvs2qP$%TM",
        { expiresIn: "90d" }
      );
      // login success
      return res.json({
        status: "success",
        message: "Authenticated Successfully",
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async adminAuthenticate(req, res, next) {
    try {
      const user = await this.model.findOne({ email: req.body.email });
      // invalid email
      if (!user) {
        return res.status(403).json({
          status: "error",
          message: "Invalid email/password!!!",
          token: null,
        });
      }

      // invalid password
      if (req.body.password !== user.password) {
        return res.status(403).json({
          status: "error",
          message: "Invalid email/password!!!",
          token: null,
        });
      }

      if (user.status !== 1) {
        return res.status(403).json({
          status: "error",
          message: "Not Admin!!!",
          token: null,
        });
      }

      const token = jwt.sign(
        {
          authUser: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
        "TFJ7bQvs2qP$%TM",
        { expiresIn: "90d" }
      );
      // login success
      return res.json({
        status: "success",
        message: "Authenticated Successfully",
        token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
