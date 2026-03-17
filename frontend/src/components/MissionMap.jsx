import React, { useEffect, useState, useCallback } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  Background
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

        const formattedEdges = []

        res.data.forEach(node => {
          node.connections?.forEach(target => {
            formattedEdges.push({
              id: `${node._id}-${target}`,
              source: node._id,
              target: target
            })
          })
        })

        setNodes(formattedNodes)
        setEdges(formattedEdges)

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

  const onNodeDoubleClick = async (event, node) => {

    const newName = prompt("Nuevo nombre del nodo:", node.data.label)

    if (!newName) return

    try {

      await axios.put(`http://localhost:5000/nodes/${node.id}`, {
        title: newName
      })

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, label: newName } }
            : n
        )
      )

    } catch (error) {

      console.error(error)

    }

  }

  const onConnect = useCallback(async (params) => {

    setEdges((eds) => addEdge(params, eds))

    try {

      await axios.post("http://localhost:5000/nodes/connect", {
        source: params.source,
        target: params.target
      })

    } catch (error) {

      console.error(error)

    }

  }, [])

  return (

    <div
      style={{
        width: "100%",
        height: "600px",
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
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        onConnect={onConnect}

        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={true}

        fitView
      >

        <Controls />
        <Background />

      </ReactFlow>

    </div>

  )

}

export default MissionMap