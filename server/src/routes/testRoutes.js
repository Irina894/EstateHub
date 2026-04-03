const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/owner-only", protect, authorizeRoles("owner"), (req, res) => {
  res.json({
    message: "Welcome, owner",
    user: req.user,
  });
});

module.exports = router;