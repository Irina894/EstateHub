const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["owner", "realtor", "client"],
      default: "client",
    },
    resetPasswordToken: {
  type: String,
  default: null,
},
resetPasswordExpires: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);