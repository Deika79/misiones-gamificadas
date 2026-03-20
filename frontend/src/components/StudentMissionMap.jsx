import React, { useEffect, useState } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls
} from "reactflow"

import { useParams } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useAxios } from "../api/axiosInstance"

import Toast from "./Toast"

import "reactflow/dist/style.css"

function StudentMissionMap() {

  const { missionId } = useParams()

  const { isAuthenticated, isLoading } = useAuth0()
  const axios = useAxios()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [xp, setXp] = useState(0)
  const [completedNodes, setCompletedNodes] = useState([])

  const [toast, setToast] = useState(null)

  // =========================
  // HELPERS
  // =========================

  const getNodeStatus = (node, completedNodes) => {

    const nodeId = node._id || node.id

    if (completedNodes.includes(nodeId)) return "completed"

    if (!node.prerequisites || node.prerequisites.length === 0) {
      return "available"
    }

    const allCompleted = node.prerequisites.every(id =>
      completedNodes.includes(id)
    )

    return allCompleted ? "available" : "locked"
  }

  const getNodeStyle = (status) => {
    switch (status) {
      case "completed":
        return { background: "#2ecc71", color: "white" }
      case "available":
        return { background: "#3498db", color: "white" }
      default:
        return { background: "#555", color: "#aaa" }
    }
  }

  // =========================
  // LOAD MISSION
  // =========================

  const loadMission = async () => {
    try {

      const nodesRes = await axios.get(`/nodes/${missionId}`)
      const progressRes = await axios.get(
        `/api/progress/mission/${missionId}`
      )

      console.log("NODES RES:", nodesRes.data)

      const completed = progressRes.data.completedNodes || []
      const xpValue = progressRes.data.xp || 0

      setCompletedNodes(completed)
      setXp(xpValue)

      // 🔥 SOPORTE FLEXIBLE BACKEND
      const rawNodes = Array.isArray(nodesRes.data)
        ? nodesRes.data
        : nodesRes.data.nodes || []

      if (!rawNodes.length) {
        console.warn("⚠️ No nodes received")
      }

      const formattedNodes = rawNodes.map((node, index) => {

        const nodeId = node._id || node.id || `node-${index}`

        const status = getNodeStatus(node, completed)

        return {
          id: nodeId,
          position: node.position || { x: 100 * index, y: 100 },
          data: {
            label: node.title || "Nodo",
            status
          },
          style: getNodeStyle(status),
          draggable: false
        }
      })

      setNodes(formattedNodes)
      setEdges([])

    } catch (err) {
      console.error(err)
      setToast("Error cargando misión")
    }
  }

  // =========================
  // LOAD CONTROLADO POR AUTH
  // =========================

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadMission()
    }
  }, [missionId, isLoading, isAuthenticated])

  // =========================
  // UI STATES
  // =========================

  if (isLoading) return <div>Cargando usuario...</div>
  if (!isAuthenticated) return <div>Debes iniciar sesión</div>

  const total = nodes.length
  const completedCount = completedNodes.length
  const progress = total > 0
    ? Math.round((completedCount / total) * 100)
    : 0

  // =========================
  // RENDER
  // =========================

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
         backgroundSize: "cover",
         backgroundPosition: "center"
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>

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