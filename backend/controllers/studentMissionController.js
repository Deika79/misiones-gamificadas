const Mission = require("../models/Mission")
const Node = require("../models/Node")
const Progress = require("../models/Progress")

exports.getStudentMission = async (req, res) => {
  try {

    const { missionId, userId } = req.params

    const mission = await Mission.findById(missionId)

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" })
    }

    const nodes = await Node.find({ missionId })

    const progress = await Progress.find({ userId })

    const completedNodeIds = progress
      .filter(p => p.completed)
      .map(p => p.nodeId.toString())

    const resultNodes = nodes.map(node => {

      const nodeId = node._id.toString()

      let status = "locked"

      const completed = completedNodeIds.includes(nodeId)

      if (completed) {
        status = "completed"
      } else {

        const required = node.requiredNodes || []

        const unlocked = required.every(r =>
          completedNodeIds.includes(r.toString())
        )

        if (required.length === 0 || unlocked) {
          status = "available"
        }
      }

      return {
        id: node._id,
        title: node.title,
        type: node.type,
        position: node.position,
        status
      }

    })

    res.json({
      missionId,
      title: mission.title,
      nodes: resultNodes,
      edges: mission.edges
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Error loading student mission"
    })

  }
}