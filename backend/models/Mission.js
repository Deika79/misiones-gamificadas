const mongoose = require("mongoose")

const MissionSchema = new mongoose.Schema({

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

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Mission", MissionSchema)