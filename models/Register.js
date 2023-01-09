const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Register = new Schema(
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

const RegisterUser = mongoose.model("RegisterUser", Register);

module.exports = RegisterUser;
