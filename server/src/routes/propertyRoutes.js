const express = require("express");
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


router.get("/", getAllProperties);
router.get("/my", protect, authorizeRoles("owner"), getMyProperties);
router.get("/:id", getPropertyById);

router.post("/", protect, authorizeRoles("owner"), createProperty);
router.put("/:id", protect, authorizeRoles("owner"), updateProperty);
router.delete("/:id", protect, authorizeRoles("owner"), deleteProperty);

module.exports = router;