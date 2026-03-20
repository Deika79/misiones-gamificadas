const Progress = require("../models/Progress");
const Node = require("../models/Node");


// =========================
// ✅ POST /progress/complete
// =========================
exports.completeNode = async (req, res) => {
  try {

    // 🔥 PROTECCIÓN CRÍTICA
    if (!req.dbUser) {
      return res.status(401).json({ message: "User not loaded in request" });
    }

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

    // 🔥 Evitar duplicados (IMPORTANTE usar string)
    const alreadyCompleted = progress.completedNodes.some(
      (id) => id.toString() === nodeId
    );

    if (alreadyCompleted) {
      return res.json(progress);
    }

    // Añadir progreso
    progress.completedNodes.push(nodeId);
    progress.xp += xpReward;

    await progress.save();

    res.json(progress);

  } catch (error) {
    console.error("❌ completeNode error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// ✅ GET /progress/mission/:missionId
// =========================
exports.getMissionProgress = async (req, res) => {
  try {

    // 🔥 PROTECCIÓN CRÍTICA
    if (!req.dbUser) {
      return res.status(401).json({ message: "User not loaded in request" });
    }

    const userId = req.dbUser._id;
    const { missionId } = req.params;

    const progress = await Progress.findOne({
      user: userId,
      mission: missionId,
    });

    if (!progress) {
      return res.json({
        completedNodes: [],
        xp: 0,
      });
    }

    res.json({
      completedNodes: progress.completedNodes,
      xp: progress.xp,
    });

  } catch (error) {
    console.error("❌ getMissionProgress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};