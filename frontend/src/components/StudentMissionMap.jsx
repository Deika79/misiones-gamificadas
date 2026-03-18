import React, { useEffect, useState } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls
} from "reactflow"

import { useParams } from "react-router-dom"

import axios from "axios"

import "reactflow/dist/style.css"

function StudentMissionMap() {

  const { missionId } = useParams()

  // TEMPORAL (luego vendrá de Auth0)
  const userId = "demoUser"

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [xp, setXp] = useState(0)

  // =========================
  // CARGAR MAPA DEL ALUMNO
  // =========================

  useEffect(() => {

    const loadMission = async () => {

      const res = await axios.get(
        `http://localhost:5000/missions/${missionId}/student/${userId}`
      )

      const formattedNodes = res.data.nodes.map(node => {

        let emoji = "🔒"

        if (node.status === "available") emoji = "🟢"
        if (node.status === "completed") emoji = "⭐"

        return {
          id: node.id,
          position: node.position,
          data: {
            label: `${emoji} ${node.title}`,
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

    }

    loadMission()

  }, [missionId, userId])

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

      alert("Aquí se abrirá la misión")

      // más adelante abriremos las TASKS

    }

    if (status === "completed") {

      alert("Nodo completado ⭐")

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

    </div>

  )

}

export default StudentMissionMap