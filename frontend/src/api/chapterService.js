import axios from "axios"

const API_URL = "http://localhost:5000/chapters"

// Obtener capítulos de un curso
export const getChaptersByCourse = async (courseId) => {
  const response = await axios.get(`${API_URL}/course/${courseId}`)
  return response.data
}

// Crear capítulo
export const createChapter = async (chapterData) => {
  const response = await axios.post(API_URL, chapterData)
  return response.data
}

// Actualizar capítulo
export const updateChapter = async (id, chapterData) => {
  const response = await axios.put(`${API_URL}/${id}`, chapterData)
  return response.data
}

// Eliminar capítulo
export const deleteChapter = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}