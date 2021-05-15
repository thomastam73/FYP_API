const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  let token;
  //   request input validation
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    [, token] = req.headers.authorization.split("Bearer ");
  } else {
    return res.status(403).json({ errors: "No token found" });
  }

  //   JWT token validation
  jwt.verify(token, "TFJ7bQvs2qP$%TM", (err, authData) => {
    if (err) {
      return res.status(403).json({ errors: "Invalid Token" });
    }
    req.authUser = authData.authUser;
    next();
  });
};

module.exports = authentication;
