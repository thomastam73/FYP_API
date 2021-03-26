const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    buildingName: {
      type: String,
      trim: true,
      required: true,
    },
    district: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "locations" },
  { versionKey: "_somethingElse" }
);

module.exports = mongoose.model("Location", LocationSchema);
