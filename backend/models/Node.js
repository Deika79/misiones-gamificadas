const mongoose = require("mongoose")

const NodeSchema = new mongoose.Schema({

  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mission",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: "city"
  },

  description: {
    type: String,
    default: ""
  },

  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },

  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node"
    }
  ],

  // 🔓 NUEVO: nodos necesarios para desbloquear este
  requiredNodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Node", NodeSchema)