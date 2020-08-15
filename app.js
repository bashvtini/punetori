const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const { wakeDynos } = require("heroku-keep-awake");
const errorHandler = require("./middleware/errorHandler");
const app = express();

// CORS
app.use(cors());
// Helemet
app.use(helmet());

app.use(express.json());

// Dev Only
require("dotenv").config({ path: "./config/config.env" });

// Connect To Database
connectDB();

// Routes
const search = require("./router/search");
const auth = require("./router/auth");

app.use("/search", search);
app.use("/auth", auth);

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  // Keep Dyno Awake
  wakeDynos([process.env.DYNO_URL], {
    interval: 25,
    logging: false,
    stopTimes: { start: "00:00", end: "06:00" },
  });
});
