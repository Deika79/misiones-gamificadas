const express = require("express")
const router = express.Router()

const {
  getStudentMission
} = require("../controllers/studentMissionController")

router.get("/missions/:missionId/student/:userId", getStudentMission)

module.exports = router