const express = require("express")
const router = express.Router()
const Mission = require("../models/Mission")

// Obtener todas las misiones
router.get("/", async (req, res) => {

  try {

    const missions = await Mission.find()

    res.json(missions)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Crear una misión
router.post("/", async (req, res) => {

  try {

    const mission = new Mission(req.body)

    await mission.save()

    res.status(201).json(mission)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router