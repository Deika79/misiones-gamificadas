const express = require("express")
const router = express.Router()

const Progress = require("../models/Progress")

// ========================================
// PROGRESO DE USUARIO EN UNA MISIÓN
// ========================================

router.get("/mission/:missionId/:userId", async (req, res) => {

  try {

    const { userId } = req.params

    const progress = await Progress.find({ userId })

    const totalXP = progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0)

    res.json({
      progress,
      totalXP,
      completedNodes: progress.length
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// ========================================
// COMPLETAR NODO
// ========================================

router.post("/complete", async (req, res) => {

  try {

    const { userId, nodeId, xpEarned } = req.body

    // comprobar si ya existe progreso
    const existing = await Progress.findOne({
      userId,
      nodeId
    })

    if (existing) {

      return res.json({
        message: "Node already completed",
        progress: existing
      })

    }

    const progress = new Progress({
      userId,
      nodeId,
      completed: true,
      xpEarned,
      completedAt: new Date()
    })

    await progress.save()

    res.json(progress)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router