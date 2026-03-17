const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// Importar rutas
const missionRoutes = require("./routes/missions")
const nodeRoutes = require("./routes/nodes")
const taskRoutes = require("./routes/tasks")

const courseRoutes = require("./routes/courses")
const chapterRoutes = require("./routes/chapters")

// Crear app
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Ruta base
app.get("/", (req, res) => {
  res.send("API Misiones funcionando")
})

// Rutas existentes
app.use("/missions", missionRoutes)
app.use("/nodes", nodeRoutes)
app.use("/tasks", taskRoutes)

// NUEVAS rutas
app.use("/courses", courseRoutes)
app.use("/chapters", chapterRoutes)

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB conectado")
})
.catch((error) => {
  console.error("Error conectando a MongoDB:", error)
})

// Arrancar servidor
const PORT = 5000

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`)
})