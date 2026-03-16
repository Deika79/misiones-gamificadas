import React from "react"
import ReactFlow from "reactflow"
import "reactflow/dist/style.css"

const nodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Roma" }
  },
  {
    id: "2",
    position: { x: 400, y: 200 },
    data: { label: "Cartago" }
  }
]

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2"
  }
]

function MissionMap() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  )
}

export default MissionMap