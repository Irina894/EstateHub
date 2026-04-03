const express = require("express");
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, authorizeRoles("owner"), createProperty);

module.exports = router;