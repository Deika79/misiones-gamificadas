const mongoose = require("mongoose")

const MissionSchema = new mongoose.Schema({

  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: false
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  background: {
    type: String,
    default: ""
  },

  teacher: {
    type: String,
    default: "Profesor"
  },

  nodes: {
    type: Array,
    default: []
  },

  edges: {
    type: Array,
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Mission", MissionSchema)