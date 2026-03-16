import React, { useEffect, useState, useCallback } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from "reactflow"

import "reactflow/dist/style.css"
import axios from "axios"

function MissionMap() {

  const missionId = "69b7e9a930d53c9aceac26d1"

  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {

    const loadNodes = async () => {

      try {

        const res = await axios.get(`http://localhost:5000/nodes/${missionId}`)

        const formattedNodes = res.data.map(node => ({
          id: node._id,
          position: node.position,
          data: { label: node.title }
        }))

        setNodes(formattedNodes)

      } catch (error) {

        console.error(error)

      }

    }

    loadNodes()

  }, [])

  const onPaneClick = useCallback(async (event) => {

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    try {

      const res = await axios.post("http://localhost:5000/nodes", {
        missionId,
        title: "Nuevo Nodo",
        position
      })

      const newNode = {
        id: res.data._id,
        position: res.data.position,
        data: { label: res.data.title }
      }

      setNodes((nds) => [...nds, newNode])

    } catch (error) {

      console.error(error)

    }

  }, [screenToFlowPosition])

  const onNodeDragStop = async (event, node) => {

    try {

      await axios.put(`http://localhost:5000/nodes/${node.id}`, {
        position: node.position
      })

    } catch (error) {

      console.error(error)

    }

  }

  const onConnect = useCallback((params) => {

    setEdges((eds) => addEdge(params, eds))

  }, [])

  return (

    <div style={{ width: "100%", height: "600px" }}>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        fitView
      />

    </div>

  )

}

export default MissionMap