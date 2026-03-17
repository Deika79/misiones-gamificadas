import React, { useState, useEffect } from "react"
import axios from "axios"

function TaskEditor({ taskId, onClose }) {

  const [task, setTask] = useState(null)

  useEffect(() => {

    const load = async () => {

      const res = await axios.get(
        `http://localhost:5000/tasks/${taskId}`
      )

      setTask(res.data)

    }

    if (taskId) load()

  }, [taskId])

  if (!task) return null

  const save = async () => {

    await axios.put(
      `http://localhost:5000/tasks/${taskId}`,
      task
    )

    alert("Tarea guardada")

  }

  return (

    <div style={{ padding: "10px", border: "1px solid #ccc", marginTop: "10px" }}>

      <h4>Editar Tarea</h4>

      <div>
        Título
        <input
          value={task.title}
          onChange={(e) =>
            setTask({ ...task, title: e.target.value })
          }
        />
      </div>

      <div>
        Tipo
        <select
          value={task.type}
          onChange={(e) =>
            setTask({ ...task, type: e.target.value })
          }
        >

          <option value="text">Texto</option>
          <option value="quiz">Quiz</option>
          <option value="video">Video</option>

        </select>
      </div>

      <div>
        Contenido
        <textarea
          rows="4"
          value={task.content}
          onChange={(e) =>
            setTask({ ...task, content: e.target.value })
          }
        />
      </div>

      <div>
        XP recompensa
        <input
          type="number"
          value={task.xpReward}
          onChange={(e) =>
            setTask({
              ...task,
              xpReward: Number(e.target.value)
            })
          }
        />
      </div>

      <button onClick={save}>
        Guardar
      </button>

      <button onClick={onClose}>
        Cerrar
      </button>

    </div>

  )

}

export default TaskEditor