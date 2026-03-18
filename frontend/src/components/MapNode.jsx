import React from "react"
import { Handle, Position } from "reactflow"

function MapNode({ data }) {

  const getIcon = () => {

    switch (data.type) {

      case "city":
        return "🏘"

      case "castle":
        return "🏰"

      case "dungeon":
        return "🗝"

      case "forest":
        return "🌲"

      case "mountain":
        return "⛰"

      default:
        return "📍"

    }

  }

  const getStatusEmoji = () => {

    if (!data.status) return ""

    if (data.status === "locked") return "🔒"
    if (data.status === "available") return "🟢"
    if (data.status === "completed") return "⭐"

    return ""

  }

  const getBorderColor = () => {

    if (!data.status) return "#333"

    if (data.status === "locked") return "#777"
    if (data.status === "available") return "#2ecc71"
    if (data.status === "completed") return "#f1c40f"

    return "#333"

  }

  return (

    <div
      style={{
        padding: "8px 12px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.95)",
        border: `3px solid ${getBorderColor()}`,
        textAlign: "center",
        minWidth: "80px",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <div style={{ fontSize: "24px" }}>
        {getIcon()}
      </div>

      <div
        style={{
          fontSize: "13px",
          fontWeight: "bold"
        }}
      >
        {data.label}
      </div>

      <div style={{ fontSize: "16px" }}>
        {getStatusEmoji()}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />

    </div>

  )

}

export default MapNode