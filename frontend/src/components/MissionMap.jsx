import React, { useEffect, useState } from "react"
import ReactFlow from "reactflow"
import "reactflow/dist/style.css"
import axios from "axios"

function MissionMap() {

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  const missionId = "69b7e9a930d53c9aceac26d1" // tu misión actual

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

  return (

    <div style={{ width: "100%", height: "600px" }}>

      <ReactFlow nodes={nodes} edges={edges} />

    </div>

  )

}

export default MissionMap