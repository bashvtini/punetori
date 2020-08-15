const mongoose = require("mongoose");

const BookmarkedJob = new mongoose.Schema({
  jobId: { type: String, required: [true, "Please provide a job id"] },
  title: {
    type: String,
    required: [true, "Please add a job title"],
  },
  link: {
    type: String,
    required: [true, "Please add a job link source"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("BookmarkedJob", BookmarkedJob);
