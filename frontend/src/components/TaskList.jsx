import React, { useEffect, useState } from "react"
import axios from "axios"
import TaskEditor from "./TaskEditor"

function TaskList({ nodeId }) {

  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)

  // ================================
  // CARGAR TAREAS
  // ================================

  const loadTasks = async () => {

    try {

      setLoading(true)

      const res = await axios.get(
        `http://localhost:5000/tasks/node/${nodeId}`
      )

      setTasks(res.data)

    } catch (error) {

      console.error("Error cargando tareas:", error)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    if (nodeId) {
      loadTasks()
    }

  }, [nodeId])

  // ================================
  // CREAR TAREA
  // ================================

  const createTask = async () => {

    const title = prompt("Nombre de la tarea")
    if (!title) return

    try {

      await axios.post(
        "http://localhost:5000/tasks",
        {
          nodeId,
          title,
          type: "text"
        }
      )

      loadTasks()

    } catch (error) {

      console.error("Error creando tarea:", error)

    }

  }

  // ================================
  // ELIMINAR TAREA
  // ================================

  const deleteTask = async (id) => {

    if (!window.confirm("¿Eliminar tarea?")) return

    try {

      await axios.delete(
        `http://localhost:5000/tasks/${id}`
      )

      loadTasks()

    } catch (error) {

      console.error("Error eliminando tarea:", error)

    }

  }

  // ================================
  // ICONO POR TIPO
  // ================================

  const getTypeIcon = (type) => {

    switch (type) {

      case "quiz":
        return "❓"

      case "multiple-choice":
        return "📝"

      case "upload":
        return "📎"

      case "code":
        return "💻"

      case "ai":
        return "🤖"

      default:
        return "📄"

    }

  }

  return (

    <div style={{ marginTop: "20px" }}>

      <h4>Tareas de la misión</h4>

      {loading && <div>Cargando tareas...</div>}

      {!loading && tasks.length === 0 && (
        <div style={{ opacity: 0.7 }}>
          No hay tareas todavía
        </div>
      )}

      {tasks.map((task) => (

        <div
          key={task._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
            padding: "6px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            background: "#fafafa"
          }}
        >

          <span
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
            onClick={() => setEditingTask(task._id)}
          >

            <span>
              {getTypeIcon(task.type)}
            </span>

            <span>
              {task.title}
            </span>

          </span>

          <button
            onClick={() => deleteTask(task._id)}
          >
            ❌
          </button>

        </div>

      ))}

      <button
        onClick={createTask}
        style={{
          marginTop: "10px",
          width: "100%"
        }}
      >
        + Nueva tarea
      </button>

      {editingTask && (

        <TaskEditor
          taskId={editingTask}
          onClose={() => {
            setEditingTask(null)
            loadTasks()
          }}
        />

      )}

    </div>

  )

}

export default TaskList