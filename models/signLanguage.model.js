const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const SignLanguageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    videoLink: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    gesture: {
      type: String,
      trim: true,
      required: true,
    },
    district: {
      type: String,
      trim: true,
      required: true,
    },
    imgURL: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "signLanguages" },
  { versionKey: "_somethingElse" }
);

SignLanguageSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SignLanguage", SignLanguageSchema);
