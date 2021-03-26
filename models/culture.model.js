const mongoose = require('mongoose');

const CultureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    countrySource: {
      type: String,
      trim: true,
      required: true,
    },
    reportDate: {
      type: Date,
      trim: true,
      required: true,
    },
  },
  { collection: 'cultures' },
  { versionKey: '_somethingElse' }
);

module.exports = mongoose.model('Culture', CultureSchema);
