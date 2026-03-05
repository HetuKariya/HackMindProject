const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @desc    Get all users (Admin only)
// @route   GET /api/users
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
