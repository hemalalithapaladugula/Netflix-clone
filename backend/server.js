const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");
const movieRoutes = require("./routes/movieRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Netflix Clone Backend is running",
  });
});


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};


// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
};

startServer();