const { body } = require("express-validator");

const userValidationRules = () => [
  // name must input
  body("name").notEmpty().withMessage("Please input a name"),
  // email must be valid
  body("email").isEmail().withMessage("Please input a valid email"),
  // password must be at least 5 chars long
  body("password")
    .isLength({ min: 5 })
    .withMessage("Please input at least 5 digits"),
];

module.exports = userValidationRules;
