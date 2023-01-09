const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const preRegisteredSchema = new Schema(
  {
    number: {
      type: Array,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const preRegisteredUser = mongoose.model(
  "preRegisteredUser",
  preRegisteredSchema
);

module.exports = preRegisteredUser;
