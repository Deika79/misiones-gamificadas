import React, { useState, useEffect } from "react"
import axios from "axios"

function TaskEditor({ taskId, onClose }) {

  const [task, setTask] = useState(null)

  useEffect(() => {

    const loadTask = async () => {

      const res = await axios.get(
        `http://localhost:5000/tasks/${taskId}`
      )

      setTask(res.data)

    }

    if (taskId) loadTask()

  }, [taskId])

  if (!task) return null

  const saveTask = async () => {

    await axios.put(
      `http://localhost:5000/tasks/${taskId}`,
      task
    )

    alert("Tarea guardada")

  }

  return (

    <div
      style={{
        marginTop: "15px",
        padding: "15px",
        border: "1px solid #ccc",
        background: "#fff"
      }}
    >

      <h4>Editar tarea</h4>

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
          <option value="video">Video</option>

        </select>
      </div>

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

      <div style={{ display: "flex", gap: "10px" }}>

        <button onClick={saveTask}>
          Guardar
        </button>

        <button onClick={onClose}>
          Cerrar
        </button>

      </div>

    </div>

  )

}

export default TaskEditor