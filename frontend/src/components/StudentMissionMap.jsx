import React, { useEffect, useState } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls
} from "reactflow"

import { useParams } from "react-router-dom"

import axios from "axios"

import TaskPlayer from "./TaskPlayer"

import "reactflow/dist/style.css"

function StudentMissionMap() {

  const { missionId } = useParams()

  // TEMPORAL (luego vendrá de Auth0)
  const userId = "demoUser"

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [xp, setXp] = useState(0)

  const [activeNode, setActiveNode] = useState(null)

  // =========================
  // CARGAR MAPA + XP
  // =========================

  const loadMission = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/missions/${missionId}/student/${userId}`
      )

      const formattedNodes = res.data.nodes.map(node => {

        return {
          id: node.id,
          position: node.position,
          data: {
            label: node.title,
            status: node.status
          },
          draggable: false
        }

      })

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

      // cargar XP
      const progressRes = await axios.get(
        `http://localhost:5000/progress/mission/${missionId}/${userId}`
      )

      setXp(progressRes.data.totalXP || 0)

    } catch (error) {

      console.error("Error cargando misión:", error)

    }

  }

  useEffect(() => {
    loadMission()
  }, [missionId])

  // =========================
  // CLICK EN NODO
  // =========================

  const onNodeClick = (event, node) => {

    const status = node.data.status

    if (status === "locked") {

      alert("Este nodo está bloqueado 🔒")
      return

    }

    if (status === "available") {

      setActiveNode(node.id)
      return

    }

    if (status === "completed") {

      alert("Nodo completado ⭐")
      return

    }

  }

  return (

    <div style={{ height: "600px" }}>

      <div
        style={{
          padding: "10px",
          background: "#222",
          color: "white",
          fontWeight: "bold"
        }}
      >

        XP total: {xp}

      </div>

      <div
        style={{
          height: "560px",
          backgroundImage: "url('/maps/map1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <ReactFlow
          nodes={nodes}
          edges={edges}

          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}

          onNodeClick={onNodeClick}

          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          panOnDrag={true}

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
            loadMission()
          }}
        />

      )}

    </div>

  )

}

export default StudentMissionMap