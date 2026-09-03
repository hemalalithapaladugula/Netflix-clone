const express = require("express");

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  createManyMovies,
} = require("../controllers/movieController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all movies
router.get("/", getMovies);

// Bulk import movies - Admin only
router.post("/bulk", protect, adminOnly, createManyMovies);

// Get single movie
router.get("/:id", getMovieById);

// Create movie - Admin only
router.post("/", protect, adminOnly, createMovie);

// Update movie - Admin only
router.put("/:id", protect, adminOnly, updateMovie);

// Delete movie - Admin only
router.delete("/:id", protect, adminOnly, deleteMovie);

module.exports = router;