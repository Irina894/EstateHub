const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "commercial", "land"],
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "pending", "sold", "hidden"],
      default: "available",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    realtorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);