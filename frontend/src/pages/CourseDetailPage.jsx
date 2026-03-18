import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getCourse } from "../api/courseService"
import { getChaptersByCourse, createChapter } from "../api/chapterService"

function CourseDetailPage() {

  const { id } = useParams()

  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])

  const [title, setTitle] = useState("")

  useEffect(() => {
    loadCourse()
    loadChapters()
  }, [])

  const loadCourse = async () => {
    try {
      const data = await getCourse(id)
      setCourse(data)
    } catch (error) {
      console.error("Error cargando curso", error)
    }
  }

  const loadChapters = async () => {
    try {
      const data = await getChaptersByCourse(id)
      setChapters(data)
    } catch (error) {
      console.error("Error cargando capítulos", error)
    }
  }

  const handleCreateChapter = async (e) => {
    e.preventDefault()

    try {

      await createChapter({
        title,
        courseId: id
      })

      setTitle("")
      loadChapters()

    } catch (error) {
      console.error("Error creando capítulo", error)
    }
  }

  if (!course) return <p>Cargando curso...</p>

  return (

    <div style={{ padding: "30px" }}>

      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <hr />

      <h2>Crear capítulo</h2>

      <form onSubmit={handleCreateChapter}>

        <input
          type="text"
          placeholder="Título del capítulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <button type="submit">
          Crear capítulo
        </button>

      </form>

      <hr />

      <h2>Capítulos</h2>

      {chapters.length === 0 && <p>No hay capítulos aún</p>}

      {chapters.map(chapter => (

        <div
          key={chapter._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>{chapter.title}</h3>

        </div>

      ))}

    </div>

  )

}

export default CourseDetailPage