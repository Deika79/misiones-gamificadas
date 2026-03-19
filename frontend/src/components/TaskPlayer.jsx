import React, { useEffect, useState } from "react"
import axios from "axios"

function TaskPlayer({ nodeId, userId, onClose, onCompleted }) {

  const [tasks, setTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)

  // ============================
  // CARGAR TAREAS
  // ============================

  useEffect(() => {

    const loadTasks = async () => {

      try {

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

    loadTasks()

  }, [nodeId])

  if (loading) {

    return (
      <div style={{ padding: "20px" }}>
        Cargando misión...
      </div>
    )

  }

  if (tasks.length === 0) {

    return (
      <div style={{ padding: "20px" }}>
        Este nodo no tiene tareas
      </div>
    )

  }

  const currentTask = tasks[currentTaskIndex]

  // ============================
  // COMPLETAR TAREA
  // ============================

  const completeTask = async () => {

    const isLastTask = currentTaskIndex === tasks.length - 1

    if (!isLastTask) {

      setCurrentTaskIndex(currentTaskIndex + 1)
      setAnswer("")
      return

    }

    // completar nodo

    try {

      await axios.post(
        "http://localhost:5000/progress/complete",
        {
          userId,
          nodeId,
          xpEarned: currentTask.xpReward
        }
      )

      alert("Nodo completado ⭐")

      if (onCompleted) {
        onCompleted()
      }

      onClose()

    } catch (error) {

      console.error("Error completando nodo:", error)

    }

  }

  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <div
        style={{
          width: "500px",
          background: "white",
          padding: "25px",
          borderRadius: "10px"
        }}
      >

        <h2>Misión</h2>

        <div style={{ marginBottom: "10px" }}>
          Tarea {currentTaskIndex + 1} / {tasks.length}
        </div>

        <h3>{currentTask.title}</h3>

        <p>{currentTask.description}</p>

        <div style={{ marginBottom: "10px" }}>
          {currentTask.content}
        </div>

        <textarea
          style={{
            width: "100%",
            height: "100px"
          }}
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Escribe tu respuesta..."
        />

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >

          <button onClick={onClose}>
            Salir
          </button>

          <button onClick={completeTask}>
            {currentTaskIndex === tasks.length - 1
              ? `Completar misión (+${currentTask.xpReward} XP)`
              : "Siguiente tarea"}
          </button>

        </div>

      </div>

    </div>

  )

}

export default TaskPlayer