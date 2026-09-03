const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    genre: {
      type: [String],
      default: [],
    },

    type: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },

    releaseYear: {
      type: Number,
    },

    duration: {
      type: String,
      default: "",
    },

    rating: {
      type: String,
      default: "",
    },

    poster: {
      type: String,
      default: "",
    },

    backdrop: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    trailerUrl: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;