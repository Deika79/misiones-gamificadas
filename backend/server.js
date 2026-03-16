const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const nodeRoutes = require("./routes/nodes")
require("dotenv").config()

// Importar rutas
const missionRoutes = require("./routes/missions")

// Crear app
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Ruta base
app.get("/", (req, res) => {
  res.send("API Misiones funcionando")
})

// Rutas
app.use("/missions", missionRoutes)

app.use("/nodes", nodeRoutes)

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