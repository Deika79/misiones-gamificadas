const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
    },
    completedNodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node",
      },
    ],
    xp: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Evita duplicados user+mission
progressSchema.index({ user: 1, mission: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);