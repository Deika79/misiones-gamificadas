import { useEffect, useState } from "react"
import { getCourses, createCourse } from "../api/courseService"

function CoursesPage() {

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

        <div>
          <input
            type="text"
            placeholder="Título del curso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">
          Crear curso
        </button>

      </form>

      <hr />

      <h2>Lista de cursos</h2>

      {courses.length === 0 && <p>No hay cursos aún</p>}

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

        </div>

      ))}

    </div>

  )

}

export default CoursesPage