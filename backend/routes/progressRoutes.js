const express = require("express");
const router = express.Router();

const {
  completeNode,
  getMissionProgress,
} = require("../controllers/progressController");

const authMiddleware = require("../middleware/authMiddleware");
const getUser = require("../middleware/getUser");

// 🔐 TODAS protegidas
router.use(authMiddleware);
router.use(getUser);

// Completar nodo
router.post("/complete", completeNode);

// Obtener progreso misión
router.get("/mission/:missionId", getMissionProgress);

module.exports = router;