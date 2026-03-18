import axios from "axios"

const API_URL = "http://localhost:5000/courses"

// Obtener cursos
export const getCourses = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Obtener curso por ID
export const getCourse = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

// Crear curso
export const createCourse = async (courseData) => {
  const response = await axios.post(API_URL, courseData)
  return response.data
}

// Actualizar curso
export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`${API_URL}/${id}`, courseData)
  return response.data
}

// Eliminar curso
export const deleteCourse = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}