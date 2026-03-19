import React, { useEffect, useState } from "react"
import axios from "axios"

function TaskPlayer({ nodeId, userId, onClose, onCompleted }) {

  const [tasks, setTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(true)

  const [completed, setCompleted] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {

    const loadTasks = async () => {

      const res = await axios.get(
        `http://localhost:5000/tasks/node/${nodeId}`
      )

      setTasks(res.data)
      setLoading(false)

    }

    loadTasks()

  }, [nodeId])

  if (loading) return <div style={{ padding: "20px" }}>Cargando...</div>

  const currentTask = tasks[currentTaskIndex]

  const completeTask = async () => {

    const isLast = currentTaskIndex === tasks.length - 1

    if (!isLast) {

      setCurrentTaskIndex(currentTaskIndex + 1)
      setAnswer("")
      return

    }

    try {

      await axios.post(
        "http://localhost:5000/progress/complete",
        {
          userId,
          nodeId,
          xpEarned: currentTask.xpReward
        }
      )

      setXpEarned(currentTask.xpReward)
      setCompleted(true)

      setTimeout(() => {

        if (onCompleted) onCompleted()
        onClose()

      }, 2000)

    } catch (error) {

      console.error(error)

    }

  }

  return (

    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        width: "500px",
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center"
      }}>

        {!completed ? (

          <>
            <h2>Misión</h2>

            <div>
              Tarea {currentTaskIndex + 1} / {tasks.length}
            </div>

            <h3>{currentTask.title}</h3>

            <p>{currentTask.description}</p>

            <textarea
              style={{ width: "100%", height: "100px" }}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div style={{ marginTop: "15px" }}>

              <button onClick={onClose}>Salir</button>

              <button onClick={completeTask}>
                {currentTaskIndex === tasks.length - 1
                  ? "Completar misión"
                  : "Siguiente"}
              </button>

            </div>

          </>

        ) : (

          <>
            <h2>🎉 ¡Misión completada!</h2>

            <h3>+{xpEarned} XP 💥</h3>

            <p>Nodo completado ⭐</p>

            <p style={{ color: "#2ecc71" }}>
              Nuevos caminos desbloqueados ✨
            </p>

          </>

        )}

      </div>

    </div>

  )

}

export default TaskPlayer