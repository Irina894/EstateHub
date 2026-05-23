const Favorite = require("../models/Favorite");
const Property = require("../models/Property");

const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    // Перевірка існування
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Перевірка на дублікат
    const existingFavorite = await Favorite.findOne({
      clientId: req.user._id,
      propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    // Створюємо запис
    const favorite = await Favorite.create({
      clientId: req.user._id,
      propertyId,
    });

    // ОНОВЛЮЄМО ЛІЧИЛЬНИК (Тільки +1)
    await Property.findByIdAndUpdate(propertyId, {
      $inc: { favoritesCount: 1 },
    });

    res.status(201).json({
      message: "Property added to favorites",
      favorite,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await Favorite.findOne({
      clientId: req.user._id,
      propertyId: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await favorite.deleteOne();

    // ЗМЕНШУЄМО ЛІЧИЛЬНИК (-1)
    await Property.findByIdAndUpdate(propertyId, {
      $inc: { favoritesCount: -1 },
    });

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addToFavorites,
  getMyFavorites,
  removeFromFavorites,
};