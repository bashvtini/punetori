const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  time: [Number],
  usedTime: [Number],
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
