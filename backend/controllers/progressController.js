const Progress = require("../models/Progress");
const Node = require("../models/Node");


// ✅ POST /progress/complete
exports.completeNode = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { missionId, nodeId } = req.body;

    if (!missionId || !nodeId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Buscar nodo (para XP)
    const node = await Node.findById(nodeId);
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    const xpReward = node.xp || 10;

    // Buscar o crear progreso
    let progress = await Progress.findOne({
      user: userId,
      mission: missionId,
    });

    if (!progress) {
      progress = new Progress({
        user: userId,
        mission: missionId,
        completedNodes: [],
        xp: 0,
      });
    }

    // Evitar duplicados
    if (progress.completedNodes.includes(nodeId)) {
      return res.json(progress);
    }

    // Añadir progreso
    progress.completedNodes.push(nodeId);
    progress.xp += xpReward;

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET /progress/mission/:missionId
exports.getMissionProgress = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { missionId } = req.params;

    let progress = await Progress.findOne({
      user: userId,
      mission: missionId,
    });

    if (!progress) {
      return res.json({
        completedNodes: [],
        xp: 0,
      });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};