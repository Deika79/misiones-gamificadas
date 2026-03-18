const express = require("express")
const router = express.Router()

const Task = require("../models/Task")

// ============================================
// OBTENER TODAS LAS TAREAS DE UN NODO
// ============================================

router.get("/node/:nodeId", async (req, res) => {

  try {

    const tasks = await Task.find({
      nodeId: req.params.nodeId
    }).sort({ order: 1 })

    res.json(tasks)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// ============================================
// OBTENER UNA TAREA
// ============================================

router.get("/:id", async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json(task)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// ============================================
// CREAR TAREA
// ============================================

router.post("/", async (req, res) => {

  try {

    const { nodeId } = req.body

    if (!nodeId) {
      return res.status(400).json({
        message: "nodeId is required"
      })
    }

    // calcular orden automáticamente
    const lastTask = await Task.findOne({ nodeId })
      .sort({ order: -1 })

    const nextOrder = lastTask ? lastTask.order + 1 : 0

    const task = new Task({
      ...req.body,
      order: nextOrder
    })

    const savedTask = await task.save()

    res.json(savedTask)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// ============================================
// ACTUALIZAR TAREA
// ============================================

router.put("/:id", async (req, res) => {

  try {

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.json(updatedTask)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// ============================================
// ELIMINAR TAREA
// ============================================

router.delete("/:id", async (req, res) => {

  try {

    const deleted = await Task.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.json({
      message: "Task deleted successfully"
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router