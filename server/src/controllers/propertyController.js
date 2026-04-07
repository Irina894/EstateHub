const Property = require("../models/Property");

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      city,
      address,
      propertyType,
      rooms,
      area,
      status,
      realtorId,
      images,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !city ||
      !address ||
      !propertyType ||
      !rooms ||
      !area
    ) {
      return res.status(400).json({
        message: "Please fill in all required property fields",
      });
    }

    const property = await Property.create({
      title,
      description,
      price,
      city,
      address,
      propertyType,
      rooms,
      area,
      status,
      realtorId,
      images,
      ownerId: req.user._id,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const { city, propertyType, minPrice, maxPrice } = req.query;

    const filter = {
      status: { $ne: "hidden" },
    };

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const properties = await Property.find(filter)
      .populate("ownerId", "name email phone role")
      .populate("realtorId", "name email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("ownerId", "name email phone role")
      .populate("realtorId", "name email phone role");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You can update only your own property",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You can delete only your own property",
      });
    }

    await property.deleteOne();

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
};