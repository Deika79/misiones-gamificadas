import React, { useEffect, useState } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls
} from "reactflow"

import { useParams } from "react-router-dom"
import axios from "axios"

import TaskPlayer from "./TaskPlayer"
import Toast from "./Toast"

import "reactflow/dist/style.css"

function StudentMissionMap() {

  const { missionId } = useParams()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [xp, setXp] = useState(0)
  const [completedNodes, setCompletedNodes] = useState([])

  const [activeNode, setActiveNode] = useState(null)
  const [toast, setToast] = useState(null)

  // =========================
  // HELPERS
  // =========================

  const getNodeStatus = (node, allNodes, completedNodes) => {

    // Si ya está completado
    if (completedNodes.includes(node.id)) {
      return "completed"
    }

    // Si no tiene dependencias → disponible
    if (!node.data.prerequisites || node.data.prerequisites.length === 0) {
      return "available"
    }

    // Verificar dependencias
    const allCompleted = node.data.prerequisites.every(id =>
      completedNodes.includes(id)
    )

    return allCompleted ? "available" : "locked"
  }

  const getNodeStyle = (status) => {
    switch (status) {
      case "completed":
        return {
          background: "#2ecc71",
          color: "white",
          border: "2px solid #27ae60"
        }
      case "available":
        return {
          background: "#3498db",
          color: "white",
          border: "2px solid #2980b9"
        }
      case "locked":
      default:
        return {
          background: "#555",
          color: "#aaa",
          border: "2px solid #333"
        }
    }
  }

  // =========================
  // CARGAR
  // =========================

  const loadMission = async () => {

    try {

      // 🔹 1. Cargar misión (SIN userId)
      const res = await axios.get(
        `http://localhost:5000/missions/${missionId}`
      )

      const missionNodes = res.data.nodes

      // 🔹 2. Cargar progreso del usuario autenticado
      const progressRes = await axios.get(
        `http://localhost:5000/api/progress/mission/${missionId}`
      )

      const completed = progressRes.data.completedNodes || []
      const xpValue = progressRes.data.xp || 0

      setCompletedNodes(completed)
      setXp(xpValue)

      // 🔹 3. Formatear nodos con estado dinámico
      const formattedNodes = missionNodes.map(node => {

        const status = getNodeStatus(node, missionNodes, completed)

        return {
          id: node._id,
          position: node.position,
          data: {
            label: node.title,
            status,
            prerequisites: node.prerequisites || []
          },
          style: getNodeStyle(status),
          draggable: false
        }
      })

      // 🔹 4. Edges
      const formattedEdges = res.data.edges.map(edge => ({
        ...edge,
        type: "smoothstep",
        style: {
          stroke: "#000",
          strokeWidth: 3
        }
      }))

      setNodes(formattedNodes)
      setEdges(formattedEdges)

    } catch (err) {
      console.error(err)
      setToast("Error cargando misión")
    }
  }

  useEffect(() => {
    loadMission()
  }, [missionId])

  // =========================
  // CLICK NODO
  // =========================

  const onNodeClick = (event, node) => {

    const status = node.data.status

    if (status === "locked") {
      setToast("Nodo bloqueado 🔒")
      return
    }

    if (status === "available") {
      setActiveNode(node.id)
      return
    }

    if (status === "completed") {
      setToast("Nodo ya completado ⭐")
    }
  }

  // =========================
  // UI HELPERS
  // =========================

  const total = nodes.length
  const completedCount = completedNodes.length
  const progress = total > 0
    ? Math.round((completedCount / total) * 100)
    : 0

  return (

    <div style={{ height: "600px" }}>

      {/* HEADER */}

      <div style={{
        padding: "10px",
        background: "#111",
        color: "white"
      }}>

        <div>XP: {xp}</div>
        <div>
          Progreso: {completedCount}/{total} ({progress}%)
        </div>

        <div style={{
          marginTop: "5px",
          height: "10px",
          background: "#444",
          borderRadius: "5px"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#2ecc71"
          }} />
        </div>

      </div>

      {/* MAPA */}

      <div style={{
        height: "540px",
        backgroundImage: "url('/maps/map1.png')",
        backgroundSize: "cover"
      }}>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
        </ReactFlow>

      </div>

      {/* TASK PLAYER */}

      {activeNode && (
        <TaskPlayer
          nodeId={activeNode}
          onClose={() => setActiveNode(null)}
          onCompleted={async () => {

            try {
              await axios.post("http://localhost:5000/api/progress/complete", {
                missionId,
                nodeId: activeNode
              })

              setActiveNode(null)
              setToast("¡Misión completada! +XP 💥")

              loadMission()

            } catch (err) {
              console.error(err)
              setToast("Error completando nodo")
            }

          }}
        />
      )}

      {/* TOAST */}

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

    </div>

  )

}

export default StudentMissionMap