const mongoose = require("mongoose");

const JobCategory = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a job category name"],
  },
  city: {
    type: String,
    required: [true, "Please provide a job city"],
  },
  jobs: Array,
  count: [Number],
});

JobCategory.index({ name: "text" });
const schema = mongoose.model("JobCategory", JobCategory);
schema.createIndexes();
module.exports = schema;
