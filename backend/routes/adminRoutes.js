const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin dashboard accessed successfully",
    admin: req.user,
  });
});

module.exports = router;