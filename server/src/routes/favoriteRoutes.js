const express = require("express");
const router = express.Router();

const {
  addToFavorites,
  getMyFavorites,
  removeFromFavorites,
} = require("../controllers/favoriteController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("client"), addToFavorites);
router.get("/my", protect, authorizeRoles("client"), getMyFavorites);
router.delete("/:propertyId", protect, authorizeRoles("client"), removeFromFavorites);

module.exports = router;