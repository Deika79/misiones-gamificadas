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
  const userId = "demoUser"

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [xp, setXp] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [total, setTotal] = useState(0)

  const [activeNode, setActiveNode] = useState(null)

  const [toast, setToast] = useState(null)

  // =========================
  // CARGAR
  // =========================

  const loadMission = async () => {

    const res = await axios.get(
      `http://localhost:5000/missions/${missionId}/student/${userId}`
    )

    const formattedNodes = res.data.nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: {
        label: node.title,
        status: node.status
      },
      draggable: false
    }))

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

    const progressRes = await axios.get(
      `http://localhost:5000/progress/mission/${missionId}/${userId}`
    )

    setXp(progressRes.data.totalXP)
    setProgress(progressRes.data.progressPercentage)
    setCompleted(progressRes.data.completedNodes)
    setTotal(progressRes.data.totalNodes)

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
          Progreso: {completed}/{total} ({progress}%)
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
          userId={userId}
          onClose={() => setActiveNode(null)}
          onCompleted={() => {
            setActiveNode(null)
            setToast("¡Misión completada! +XP 💥")
            loadMission()
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