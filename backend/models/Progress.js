const mongoose = require("mongoose")

const ProgressSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true
  },

  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  },

  xpEarned: {
    type: Number,
    default: 0
  },

  completedAt: {
    type: Date
  }

})

module.exports = mongoose.model("Progress", ProgressSchema)