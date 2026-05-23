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

    // АНАЛІТИКА (Як на DOM.RIA)
    viewsCount: {
      type: Number,
      default: 0,
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },

    // МАРКЕТИНГОВІ МІТКИ (Для бізнес-логіки)
    isTopOffer: {
      type: Boolean,
      default: false,
    },
    isPriceReduced: {
      type: Boolean,
      default: false,
    },
    isRealtorVerified: {
      type: Boolean,
      default: false,
    },

    // ДОДАТКОВІ ХАРАКТЕРИСТИКИ (Для розширених фільтрів)
    floor: {
      type: Number,
      default: null,
    },
    totalFloors: {
      type: Number,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);
propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model("Property", propertySchema);