const express = require("express")
const router = express.Router()

const Task = require("../models/Task")

// Obtener tareas de un nodo

router.get("/:nodeId", async (req, res) => {

  try {

    const tasks = await Task.find({
      nodeId: req.params.nodeId
    })

    res.json(tasks)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Crear tarea

router.post("/", async (req, res) => {

  try {

    const task = new Task(req.body)

    const savedTask = await task.save()

    res.json(savedTask)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Actualizar tarea

router.put("/:id", async (req, res) => {

  try {

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedTask)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Eliminar tarea

router.delete("/:id", async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id)

    res.json({
      message: "Tarea eliminada"
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router