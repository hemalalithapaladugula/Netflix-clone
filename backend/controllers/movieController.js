const Movie = require("../models/Movie");

// =========================
// GET ALL MOVIES
// =========================
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error("Get Movies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// GET SINGLE MOVIE
// =========================
const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;

    // First try MongoDB _id
    let movie = null;

    if (movieId.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(movieId);
    }

    // If MongoDB _id is not provided,
    // support frontend numeric IDs using created order
    if (!movie) {
      const movies = await Movie.find().sort({ createdAt: 1 });

      const numericId = Number(movieId);

      if (
        !Number.isNaN(numericId) &&
        numericId >= 1 &&
        numericId <= movies.length
      ) {
        movie = movies[numericId - 1];
      }
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Get Movie Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =========================
// CREATE MOVIE
// =========================
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    console.error("Create Movie Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};


// =========================
// UPDATE MOVIE
// =========================
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("Update Movie Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
};


// =========================
// DELETE MOVIE
// =========================
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Delete Movie Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};
// =========================
// BULK CREATE MOVIES
// =========================

const createManyMovies = async (req, res) => {
  try {
    const movies = req.body;

    if (!Array.isArray(movies) || movies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Movies array is required",
      });
    }

    const createdMovies = await Movie.insertMany(movies);

    return res.status(201).json({
      success: true,
      message: "Movies imported successfully",
      count: createdMovies.length,
      movies: createdMovies,
    });
  } catch (error) {
    console.error("Bulk Movie Import Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to import movies",
    });
  }
};


module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  createManyMovies,
};