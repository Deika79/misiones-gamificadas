const express = require("express");
const router = express.Router();

const Node = require("../models/Node");

// 🔐 MIDDLEWARE AUTH
const checkJwt = require("../middleware/authMiddleware");
const getUser = require("../middleware/getUser");
const syncUser = require("../middleware/syncUser");

// 🔒 PROTEGER TODAS LAS RUTAS
router.use(checkJwt, getUser, syncUser);

// =========================
// OBTENER NODOS DE UNA MISIÓN
// =========================
router.get("/:missionId", async (req, res) => {

  try {

    const nodes = await Node.find({
      missionId: req.params.missionId
    });

    res.json(nodes);

  } catch (error) {

    console.error("Error getting nodes:", error);
    res.status(500).json({ error: error.message });

  }

});


// =========================
// CREAR NODO
// =========================
router.post("/", async (req, res) => {

  try {

    const node = new Node({
      ...req.body,
      connections: req.body.connections || []
    });

    const savedNode = await node.save();

    res.json(savedNode);

  } catch (error) {

    console.error("Error creating node:", error);
    res.status(500).json({ error: error.message });

  }

});


// =========================
// ACTUALIZAR NODO
// =========================
router.put("/:id", async (req, res) => {

  try {

    const updatedNode = await Node.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedNode);

  } catch (error) {

    console.error("Error updating node:", error);
    res.status(500).json({ error: error.message });

  }

});


// =========================
// BORRAR NODO
// =========================
router.delete("/:id", async (req, res) => {

  try {

    await Node.findByIdAndDelete(req.params.id);

    // 🔥 limpiar conexiones que apuntaban a este nodo
    await Node.updateMany(
      { connections: req.params.id },
      { $pull: { connections: req.params.id } }
    );

    res.json({
      message: "Nodo eliminado correctamente"
    });

  } catch (error) {

    console.error("Error deleting node:", error);
    res.status(500).json({ error: error.message });

  }

});


// =========================
// CONECTAR NODOS
// =========================
router.post("/connect", async (req, res) => {

  try {

    const { source, target } = req.body;

    await Node.findByIdAndUpdate(source, {
      $addToSet: { connections: target } // evita duplicados
    });

    res.json({ message: "Conexión guardada" });

  } catch (error) {

    console.error("Error connecting nodes:", error);
    res.status(500).json({ error: error.message });

  }

});


// =========================
// DESCONECTAR NODOS
// =========================
router.post("/disconnect", async (req, res) => {

  try {

    const { source, target } = req.body;

    await Node.findByIdAndUpdate(source, {
      $pull: { connections: target }
    });

    res.json({
      message: "Conexión eliminada"
    });

  } catch (error) {

    console.error("Error disconnecting nodes:", error);
    res.status(500).json({ error: error.message });

  }

});

module.exports = router;