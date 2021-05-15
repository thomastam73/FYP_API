const { body } = require("express-validator");

const authValidationRules = () => [
  body("email").notEmpty().withMessage("Please input email"),
  body("password").notEmpty().withMessage("Please input password"),
];

module.exports = authValidationRules;
