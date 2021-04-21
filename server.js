require("./database/mongodb.connect");
const app = require("./app");

// Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  app.use(bodyParser.json({ limit: "20mb" }));
  // eslint-disable-next-line no-console
  console.log(`Deaf and Dumb People API Server is now running on port ${PORT}`);
});
