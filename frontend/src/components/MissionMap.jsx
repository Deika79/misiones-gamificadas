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

import MapNode from "./MapNode"

const nodeTypes = {
  mapNode: MapNode
}

function MissionMap() {

  const missionId = "69b7e9a930d53c9aceac26d1"

  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {

    const loadNodes = async () => {

      const res = await axios.get(`http://localhost:5000/nodes/${missionId}`)

      const formattedNodes = res.data.map(node => ({
        id: node._id,
        type: "mapNode",
        position: node.position,
        data: {
          label: node.title,
          type: "city"
        }
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

    }

    loadNodes()

  }, [])

  const onPaneClick = useCallback(async (event) => {

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    const res = await axios.post("http://localhost:5000/nodes", {
      missionId,
      title: "Nuevo Nodo",
      position
    })

    const newNode = {
      id: res.data._id,
      type: "mapNode",
      position: res.data.position,
      data: {
        label: res.data.title,
        type: "city"
      }
    }

    setNodes((nds) => [...nds, newNode])

  }, [screenToFlowPosition])

  const onNodeDragStop = async (event, node) => {

    await axios.put(`http://localhost:5000/nodes/${node.id}`, {
      position: node.position
    })

  }

  const onNodeDoubleClick = async (event, node) => {

    const newName = prompt("Nuevo nombre del nodo:", node.data.label)

    if (!newName) return

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

  }

  const onConnect = useCallback(async (params) => {

    setEdges((eds) => addEdge(params, eds))

    await axios.post("http://localhost:5000/nodes/connect", {
      source: params.source,
      target: params.target
    })

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
        nodeTypes={nodeTypes}

        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        onConnect={onConnect}

        zoomOnScroll
        panOnDrag

        fitView
      >

        <Controls />
        <Background />

      </ReactFlow>

    </div>

  )

}

export default MissionMap