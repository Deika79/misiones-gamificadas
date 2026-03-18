import axios from "axios"

const API_URL = "http://localhost:5000/missions"

// obtener misiones por capítulo
export const getMissionsByChapter = async (chapterId) => {
  const response = await axios.get(`${API_URL}/chapter/${chapterId}`)
  return response.data
}

// crear misión
export const createMission = async (missionData) => {
  const response = await axios.post(API_URL, missionData)
  return response.data
}

// eliminar misión
export const deleteMission = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}