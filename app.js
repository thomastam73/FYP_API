const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")({ origin: true });
const { handleErrorResponse } = require("./middlewares");

// init
const app = express();
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Auth Route
app.use("/login", require("./routes/auth.routes"));
app.use("/register", require("./routes/register.routes"));
// Routes
app.use("/listeningAids", require("./routes/listeningAid.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/cultures", require("./routes/culture.routes"));
app.use("/signLanguages", require("./routes/signLanguage.routes"));
app.use("/locations", require("./routes/location.routes"));

// handle status 500 exception response
app.use(handleErrorResponse);

module.exports = app;
