import React, { useEffect, useState } from "react"
import axios from "axios"

function TaskList({ nodeId }) {

  const [tasks, setTasks] = useState([])

  const loadTasks = async () => {

    const res = await axios.get(
      `http://localhost:5000/tasks/${nodeId}`
    )

    setTasks(res.data)

  }

  useEffect(() => {

    if (nodeId) {
      loadTasks()
    }

  }, [nodeId])

  const createTask = async () => {

    const title = prompt("Nombre de la tarea:")
    if (!title) return

    const type = prompt(
      "Tipo: text, quiz, video",
      "text"
    )

    await axios.post("http://localhost:5000/tasks", {
      nodeId,
      title,
      type
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

          <span>
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

    </div>

  )

}

export default TaskList