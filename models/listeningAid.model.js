const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ListeningAidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    mark: {
      type: Number,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "listeningAids" },
  { versionKey: "_somethingElse" }
);

ListeningAidSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ListeningAid", ListeningAidSchema);
