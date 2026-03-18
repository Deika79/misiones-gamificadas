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


// Obtener misiones por capítulo
router.get("/chapter/:chapterId", async (req, res) => {

  try {

    const missions = await Mission.find({
      chapterId: req.params.chapterId
    })

    res.json(missions)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Obtener misión por ID
router.get("/:id", async (req, res) => {

  try {

    const mission = await Mission.findById(req.params.id)

    res.json(mission)

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


// Actualizar misión
router.put("/:id", async (req, res) => {

  try {

    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(mission)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Eliminar misión
router.delete("/:id", async (req, res) => {

  try {

    await Mission.findByIdAndDelete(req.params.id)

    res.json({ message: "Misión eliminada" })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router