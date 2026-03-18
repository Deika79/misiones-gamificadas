const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({

  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    enum: [
      "text",
      "quiz",
      "multiple-choice",
      "upload",
      "link",
      "code",
      "ai"
    ],
    default: "text"
  },

  order: {
    type: Number,
    default: 0
  },

  content: {
    type: String,
    default: ""
  },

  options: [
    {
      text: String,
      correct: Boolean
    }
  ],

  correctAnswer: {
    type: String,
    default: ""
  },

  xpReward: {
    type: Number,
    default: 10
  },

  bonusXP: {
    type: Number,
    default: 0
  },

  penaltyXP: {
    type: Number,
    default: 0
  },

  maxAttempts: {
    type: Number,
    default: 3
  },

  isRequired: {
    type: Boolean,
    default: true
  },

  metadata: {
    type: Object,
    default: {}
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Task", TaskSchema)