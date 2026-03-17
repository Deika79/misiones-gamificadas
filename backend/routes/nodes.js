const express = require("express")
const router = express.Router()

const Node = require("../models/Node")

// Obtener nodos de una misión

router.get("/:missionId", async (req, res) => {

  try {

    const nodes = await Node.find({
      missionId: req.params.missionId
    })

    res.json(nodes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Crear nodo

router.post("/", async (req, res) => {

  try {

    const node = new Node(req.body)

    const savedNode = await node.save()

    res.json(savedNode)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Actualizar nodo

router.put("/:id", async (req, res) => {

  try {

    const updatedNode = await Node.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedNode)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Borrar nodo

router.delete("/:id", async (req, res) => {

  try {

    await Node.findByIdAndDelete(req.params.id)

    // quitar conexiones que apuntaban a este nodo

    await Node.updateMany(
      {},
      { $pull: { connections: req.params.id } }
    )

    res.json({
      message: "Nodo eliminado correctamente"
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Conectar nodos

router.post("/connect", async (req, res) => {

  try {

    const { source, target } = req.body

    const node = await Node.findById(source)

    if (!node.connections.includes(target)) {

      node.connections.push(target)

      await node.save()

    }

    res.json({ message: "Conexión guardada" })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


// Desconectar nodos

router.post("/disconnect", async (req, res) => {

  try {

    const { source, target } = req.body

    await Node.findByIdAndUpdate(source, {
      $pull: { connections: target }
    })

    res.json({
      message: "Conexión eliminada"
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router