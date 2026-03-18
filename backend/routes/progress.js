const express = require("express")
const router = express.Router()
const Progress = require("../models/Progress")

// progreso de un usuario en una misión
router.get("/mission/:missionId/:userId", async (req, res) => {

  try {

    const progress = await Progress.find({
      userId: req.params.userId
    })

    res.json(progress)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// completar nodo
router.post("/complete", async (req, res) => {

  try {

    const { userId, nodeId, xpEarned } = req.body

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