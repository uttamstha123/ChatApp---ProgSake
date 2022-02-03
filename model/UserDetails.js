const mongoose = require("mongoose");
const userDetailSchema = mongoose.Schema({
  email:{
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password1: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
    max: 50,
  },

},
{
  timestamps: true
});

module.exports = mongoose.model("userDetails", userDetailSchema);
