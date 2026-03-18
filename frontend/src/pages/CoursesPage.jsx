import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCourses, createCourse } from "../api/courseService"

function CoursesPage() {

  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (error) {
      console.error("Error cargando cursos", error)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()

    try {

      await createCourse({
        title,
        description
      })

      setTitle("")
      setDescription("")
      loadCourses()

    } catch (error) {
      console.error("Error creando curso", error)
    }
  }

  return (

    <div style={{ padding: "30px" }}>

      <h1>Cursos</h1>

      <h2>Crear nuevo curso</h2>

      <form onSubmit={handleCreateCourse}>

        <input
          type="text"
          placeholder="Título del curso"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          Crear curso
        </button>

      </form>

      <hr />

      <h2>Lista de cursos</h2>

      {courses.map(course => (

        <div
          key={course._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <button
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            Entrar al curso
          </button>

        </div>

      ))}

    </div>

  )

}

export default CoursesPage