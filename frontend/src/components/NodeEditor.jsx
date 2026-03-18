import React, { useState, useEffect } from "react"
import axios from "axios"
import TaskList from "./TaskList"

function NodeEditor({ node, onUpdate, onDelete }) {

  const [title, setTitle] = useState("")
  const [type, setType] = useState("city")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // =============================
  // CARGAR DATOS DEL NODO
  // =============================

  useEffect(() => {

    if (node) {

      setTitle(node.data.label || "")
      setType(node.data.type || "city")
      setDescription(node.data.description || "")

    }

  }, [node])

  if (!node) {

    return (
      <div style={{ padding: "20px" }}>
        <h3>Editor de Nodo</h3>
        Selecciona un nodo en el mapa
      </div>
    )

  }

  // =============================
  // GUARDAR NODO
  // =============================

  const save = async () => {

    if (!title.trim()) {
      alert("El nodo debe tener un nombre")
      return
    }

    try {

      setLoading(true)

      const res = await axios.put(
        `http://localhost:5000/nodes/${node.id}`,
        {
          title,
          type,
          description
        }
      )

      onUpdate(res.data)

    } catch (error) {

      console.error("Error actualizando nodo:", error)

    } finally {

      setLoading(false)

    }

  }

  // =============================
  // ELIMINAR NODO
  // =============================

  const deleteNode = async () => {

    if (!window.confirm("¿Eliminar nodo? Esta acción no se puede deshacer.")) return

    try {

      await axios.delete(
        `http://localhost:5000/nodes/${node.id}`
      )

      onDelete(node.id)

    } catch (error) {

      console.error("Error eliminando nodo:", error)

    }

  }

  return (

    <div style={{ padding: "20px" }}>

      <h3>Editor de Nodo</h3>

      {/* =============================
      DATOS DEL NODO
      ============================= */}

      <div style={{ marginBottom: "10px" }}>
        <label>Nombre</label>
        <input
          style={{ width: "100%" }}
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Tipo</label>
        <select
          style={{ width: "100%" }}
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >

          <option value="city">Ciudad</option>
          <option value="castle">Castillo</option>
          <option value="dungeon">Dungeon</option>
          <option value="forest">Bosque</option>
          <option value="mountain">Montaña</option>

        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Descripción</label>
        <textarea
          style={{ width: "100%" }}
          rows="4"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <button
        onClick={save}
        disabled={loading}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px"
        }}
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>

      <hr />

      {/* =============================
      ELIMINAR NODO
      ============================= */}

      <button
        onClick={deleteNode}
        style={{
          width: "100%",
          background: "red",
          color: "white",
          padding: "8px"
        }}
      >
        Eliminar Nodo
      </button>

      <hr />

      {/* =============================
      TAREAS DEL NODO
      ============================= */}

      <h4>Tareas de la misión</h4>

      <TaskList nodeId={node.id} />

    </div>

  )

}

export default NodeEditor