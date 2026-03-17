const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({

  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: "text"
  },

  content: {
    type: String,
    default: ""
  },

  xpReward: {
    type: Number,
    default: 10
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Task", TaskSchema)