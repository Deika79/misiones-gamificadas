import React, { useState, useEffect } from "react"
import axios from "axios"

function TaskEditor({ taskId, onClose }) {

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)

  // ============================
  // CARGAR TAREA
  // ============================

  useEffect(() => {

    const loadTask = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/tasks/${taskId}`
        )

        setTask(res.data)

      } catch (error) {

        console.error("Error cargando tarea:", error)

      }

    }

    if (taskId) loadTask()

  }, [taskId])

  if (!task) return null

  // ============================
  // GUARDAR TAREA
  // ============================

  const saveTask = async () => {

    try {

      setLoading(true)

      await axios.put(
        `http://localhost:5000/tasks/${taskId}`,
        task
      )

      alert("Tarea guardada")

    } catch (error) {

      console.error("Error guardando tarea:", error)

    } finally {

      setLoading(false)

    }

  }

  return (

    <div
      style={{
        marginTop: "15px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        background: "#fff"
      }}
    >

      <h4>Editar tarea</h4>

      {/* ============================
      TITULO
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Título</label>

        <input
          style={{ width: "100%" }}
          value={task.title}
          onChange={(e) =>
            setTask({
              ...task,
              title: e.target.value
            })
          }
        />

      </div>

      {/* ============================
      TIPO
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Tipo</label>

        <select
          style={{ width: "100%" }}
          value={task.type}
          onChange={(e) =>
            setTask({
              ...task,
              type: e.target.value
            })
          }
        >

          <option value="text">Texto</option>
          <option value="quiz">Quiz</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="upload">Subir archivo</option>
          <option value="code">Código</option>
          <option value="ai">Actividad IA</option>

        </select>

      </div>

      {/* ============================
      DESCRIPCIÓN
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Descripción</label>

        <textarea
          rows="2"
          style={{ width: "100%" }}
          value={task.description || ""}
          onChange={(e) =>
            setTask({
              ...task,
              description: e.target.value
            })
          }
        />

      </div>

      {/* ============================
      CONTENIDO
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Contenido</label>

        <textarea
          rows="5"
          style={{ width: "100%" }}
          value={task.content}
          onChange={(e) =>
            setTask({
              ...task,
              content: e.target.value
            })
          }
        />

      </div>

      {/* ============================
      XP
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>XP recompensa</label>

        <input
          type="number"
          style={{ width: "100%" }}
          value={task.xpReward}
          onChange={(e) =>
            setTask({
              ...task,
              xpReward: Number(e.target.value)
            })
          }
        />

      </div>

      {/* ============================
      BONUS XP
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Bonus XP</label>

        <input
          type="number"
          style={{ width: "100%" }}
          value={task.bonusXP || 0}
          onChange={(e) =>
            setTask({
              ...task,
              bonusXP: Number(e.target.value)
            })
          }
        />

      </div>

      {/* ============================
      INTENTOS
      ============================ */}

      <div style={{ marginBottom: "10px" }}>

        <label>Intentos máximos</label>

        <input
          type="number"
          style={{ width: "100%" }}
          value={task.maxAttempts || 3}
          onChange={(e) =>
            setTask({
              ...task,
              maxAttempts: Number(e.target.value)
            })
          }
        />

      </div>

      {/* ============================
      BOTONES
      ============================ */}

      <div style={{ display: "flex", gap: "10px" }}>

        <button
          onClick={saveTask}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button onClick={onClose}>
          Cerrar
        </button>

      </div>

    </div>

  )

}

export default TaskEditor