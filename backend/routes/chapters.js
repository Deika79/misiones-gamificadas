const express = require("express")
const router = express.Router()
const Chapter = require("../models/Chapter")

// Obtener capítulos de un curso
router.get("/course/:courseId", async (req, res) => {
  try {
    const chapters = await Chapter.find({
      courseId: req.params.courseId
    }).sort({ order: 1 })

    res.json(chapters)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear capítulo
router.post("/", async (req, res) => {
  try {
    const chapter = new Chapter(req.body)
    const saved = await chapter.save()
    res.json(saved)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar capítulo
router.put("/:id", async (req, res) => {
  try {
    const updated = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Eliminar capítulo
router.delete("/:id", async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id)
    res.json({ message: "Capítulo eliminado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router