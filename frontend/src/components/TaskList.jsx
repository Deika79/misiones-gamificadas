import React, { useEffect, useState } from "react"
import axios from "axios"
import TaskEditor from "./TaskEditor"

function TaskList({ nodeId }) {

  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = async () => {

    const res = await axios.get(
      `http://localhost:5000/tasks/${nodeId}`
    )

    setTasks(res.data)

  }

  useEffect(() => {

    if (nodeId) loadTasks()

  }, [nodeId])

  const createTask = async () => {

    const title = prompt("Nombre tarea")
    if (!title) return

    await axios.post("http://localhost:5000/tasks", {
      nodeId,
      title,
      type: "text"
    })

    loadTasks()

  }

  const deleteTask = async (id) => {

    if (!window.confirm("Eliminar tarea?")) return

    await axios.delete(
      `http://localhost:5000/tasks/${id}`
    )

    loadTasks()

  }

  return (

    <div style={{ marginTop: "20px" }}>

      <h4>Tareas</h4>

      {tasks.map((task) => (

        <div
          key={task._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px"
          }}
        >

          <span
            style={{ cursor: "pointer" }}
            onClick={() => setEditingTask(task._id)}
          >
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task._id)}
          >
            ❌
          </button>

        </div>

      ))}

      <button onClick={createTask}>
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