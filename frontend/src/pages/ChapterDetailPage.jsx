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
    const data = await getMissionsByChapter(id)
    setMissions(data)
  }

  const handleCreateMission = async (e) => {
    e.preventDefault()

    await createMission({
      title,
      chapterId: id
    })

    setTitle("")
    loadMissions()
  }

  return (

    <div style={{ padding: "30px" }}>

      <h1>Mapas de misión</h1>

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