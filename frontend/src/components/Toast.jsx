import React, { useEffect } from "react"

function Toast({ message, onClose }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onClose()
    }, 2000)

    return () => clearTimeout(timer)

  }, [])

  return (

    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#222",
        color: "white",
        padding: "12px 18px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 9999,
        fontWeight: "bold"
      }}
    >

      {message}

    </div>

  )

}

export default Toast