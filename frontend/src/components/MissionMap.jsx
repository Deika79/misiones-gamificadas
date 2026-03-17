import React, { useEffect, useState, useCallback } from "react"
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls
} from "reactflow"

import "reactflow/dist/style.css"
import axios from "axios"

import MapNode from "./MapNode"
import NodeEditor from "./NodeEditor"

const nodeTypes = {
  mapNode: MapNode
}

function MissionMap() {

  const missionId = "69b7e9a930d53c9aceac26d1"

  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {

    const loadNodes = async () => {

      const res = await axios.get(
        `http://localhost:5000/nodes/${missionId}`
      )

      const formattedNodes = res.data.map(node => ({
        id: node._id,
        type: "mapNode",
        position: node.position,
        data: {
          label: node.title,
          type: node.type || "city",
          description: node.description || ""
        }
      }))

      const formattedEdges = []

      res.data.forEach(node => {

        node.connections?.forEach(target => {

          formattedEdges.push({
            id: `${node._id}-${target}`,
            source: node._id,
            target: target,
            type: "smoothstep",
            style: {
              stroke: "#000",
              strokeWidth: 3
            }
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

    const title = prompt("Nombre del nodo:", "Nuevo Nodo")
    if (!title) return

    const type = prompt(
      "Tipo de nodo: city, castle, dungeon, forest, mountain",
      "city"
    )

    const res = await axios.post(
      "http://localhost:5000/nodes",
      {
        missionId,
        title,
        type,
        position
      }
    )

    const newNode = {
      id: res.data._id,
      type: "mapNode",
      position: res.data.position,
      data: {
        label: res.data.title,
        type: res.data.type || "city"
      }
    }

    setNodes((nds) => [...nds, newNode])

  }, [screenToFlowPosition])

  const onNodeClick = (event, node) => {
    setSelectedNode(node)
  }

  const onNodeDragStop = async (event, node) => {

    await axios.put(
      `http://localhost:5000/nodes/${node.id}`,
      {
        position: node.position
      }
    )

  }

  const onConnect = useCallback(async (params) => {

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          style: {
            stroke: "#000",
            strokeWidth: 3
          }
        },
        eds
      )
    )

    await axios.post(
      "http://localhost:5000/nodes/connect",
      {
        source: params.source,
        target: params.target
      }
    )

  }, [])

  return (

    <div style={{ display: "flex", height: "600px" }}>

      <div
        style={{
          flex: 3,
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
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}

          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          panOnDrag={true}

          fitView
        >

          <Controls />

        </ReactFlow>

      </div>

      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ccc",
          background: "#f9f9f9"
        }}
      >

        <NodeEditor
          node={selectedNode}
          onUpdate={(updatedNode) => {

            setNodes((nds) =>
              nds.map((n) =>
                n.id === updatedNode._id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        label: updatedNode.title,
                        type: updatedNode.type,
                        description: updatedNode.description
                      }
                    }
                  : n
              )
            )

          }}
          onDelete={(nodeId) => {

            setNodes((nds) =>
              nds.filter((n) => n.id !== nodeId)
            )

            setEdges((eds) =>
              eds.filter(
                (e) =>
                  e.source !== nodeId &&
                  e.target !== nodeId
              )
            )

            setSelectedNode(null)

          }}
        />

      </div>

    </div>

  )

}

export default MissionMap