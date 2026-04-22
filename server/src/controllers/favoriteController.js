const Favorite = require("../models/Favorite");
const Property = require("../models/Property");

const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        message: "Property ID is required",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const existingFavorite = await Favorite.findOne({
      clientId: req.user._id,
      propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Property is already in favorites",
      });
    }

    const favorite = await Favorite.create({
      clientId: req.user._id,
      propertyId,
    });

    res.status(201).json({
      message: "Property added to favorites",
      favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ clientId: req.user._id })
      .populate({
        path: "propertyId",
        populate: {
          path: "ownerId",
          select: "name email phone role",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      clientId: req.user._id,
      propertyId: req.params.propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    await favorite.deleteOne();

    res.status(200).json({
      message: "Property removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addToFavorites,
  getMyFavorites,
  removeFromFavorites,
};