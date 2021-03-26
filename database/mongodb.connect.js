const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(
  "mongodb+srv://manmanbbg:19990703@deafanddumbpeople.dw5hm.mongodb.net/DeafAndDumbPeopleApp?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

module.exports = mongoose;
