import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMissionsByChapter, createMission } from "../api/missionService"

function ChapterDetailPage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [missions, setMissions] = useState([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    loadMissions()
  }, [])

  const loadMissions = async () => {
    try {
      const data = await getMissionsByChapter(id)
      setMissions(data)
    } catch (error) {
      console.error("Error cargando misiones", error)
    }
  }

  const handleCreateMission = async (e) => {
    e.preventDefault()

    try {

      await createMission({
        title,
        chapterId: id
      })

      setTitle("")
      loadMissions()

    } catch (error) {
      console.error("Error creando misión", error)
    }
  }

  return (

    <div style={{ padding: "30px" }}>

      <h1>Mapas de misión</h1>

      <h2>Crear nuevo mapa</h2>

      <form onSubmit={handleCreateMission}>

        <input
          type="text"
          placeholder="Título del mapa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <button type="submit">
          Crear mapa
        </button>

      </form>

      <hr />

      <h2>Mapas</h2>

      {missions.map(mission => (

        <div
          key={mission._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>{mission.title}</h3>

          <button
            onClick={() => navigate(`/mission/${mission._id}`)}
          >
            Abrir editor
          </button>

        </div>

      ))}

    </div>

  )

}

export default ChapterDetailPage