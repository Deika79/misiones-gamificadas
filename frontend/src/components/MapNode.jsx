import React from "react"

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

  return (

    <div
      style={{
        padding: "6px 10px",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.9)",
        border: "2px solid #333",
        fontSize: "14px",
        textAlign: "center",
        minWidth: "70px"
      }}
    >

      <div style={{ fontSize: "22px" }}>
        {getIcon()}
      </div>

      <div>
        {data.label}
      </div>

    </div>

  )

}

export default MapNode