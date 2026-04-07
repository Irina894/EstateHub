const express = require("express");
const router = express.Router();

const {
  createApplication,
  getMyApplications,
  getApplicationsForOwner,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("client"), createApplication);
router.get("/my", protect, authorizeRoles("client"), getMyApplications);
router.get("/owner", protect, authorizeRoles("owner"), getApplicationsForOwner);
router.put("/:id/status", protect, authorizeRoles("owner"), updateApplicationStatus);

module.exports = router;