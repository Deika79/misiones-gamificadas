const express = require("express")
const router = express.Router()
const Course = require("../models/Course")

// Obtener todos los cursos
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear curso
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body)
    const savedCourse = await course.save()
    res.json(savedCourse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener curso por ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.json(course)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar curso
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Eliminar curso
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    res.json({ message: "Curso eliminado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router