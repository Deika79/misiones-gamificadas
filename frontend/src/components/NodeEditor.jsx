import React, { useState, useEffect } from "react"
import axios from "axios"

function NodeEditor({ node, onUpdate, onDelete }) {

  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {

    if (node) {

      setTitle(node.data.label)
      setType(node.data.type || "city")
      setDescription(node.data.description || "")

    }

  }, [node])

  if (!node) {

    return (
      <div style={{ padding: "20px" }}>
        Selecciona un nodo
      </div>
    )

  }

  const save = async () => {

    const res = await axios.put(
      `http://localhost:5000/nodes/${node.id}`,
      {
        title,
        type,
        description
      }
    )

    onUpdate(res.data)

  }

  const deleteNode = async () => {

    if (!window.confirm("¿Eliminar este nodo?")) return

    await axios.delete(
      `http://localhost:5000/nodes/${node.id}`
    )

    onDelete(node.id)

  }

  return (

    <div style={{ padding: "20px" }}>

      <h3>Editor de Nodo</h3>

      <div>
        Nombre
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        Tipo
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >

          <option value="city">Ciudad</option>
          <option value="castle">Castillo</option>
          <option value="dungeon">Dungeon</option>
          <option value="forest">Bosque</option>
          <option value="mountain">Montaña</option>

        </select>
      </div>

      <div>
        Descripción
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button onClick={save}>
        Guardar
      </button>

      <hr />

      <button
        onClick={deleteNode}
        style={{ background: "red", color: "white" }}
      >
        Eliminar Nodo
      </button>

    </div>

  )

}

export default NodeEditor