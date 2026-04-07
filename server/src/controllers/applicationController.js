const Application = require("../models/Application");
const Property = require("../models/Property");

const createApplication = async (req, res) => {
  try {
    const { propertyId, message, phone } = req.body;

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

    const existingApplication = await Application.findOne({
      propertyId,
      clientId: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this property",
      });
    }

    const application = await Application.create({
      propertyId,
      clientId: req.user._id,
      ownerId: property.ownerId,
      message,
      phone,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ clientId: req.user._id })
      .populate("propertyId")
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getApplicationsForOwner = async (req, res) => {
  try {
    const applications = await Application.find({ ownerId: req.user._id })
      .populate("propertyId")
      .populate("clientId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You can update only applications for your properties",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsForOwner,
  updateApplicationStatus,
};