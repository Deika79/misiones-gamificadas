const User = require("../models/User")

module.exports = async (req, res, next) => {
  try {

    // 🔥 authMiddleware guarda esto
    const auth0Id = req.auth?.sub

    if (!auth0Id) {
      console.error("❌ No auth.sub in request")
      return res.status(401).json({ message: "No auth0Id" })
    }

    const user = await User.findOne({ auth0Id })

    if (!user) {
      console.error("❌ User not found in DB:", auth0Id)
      return res.status(404).json({ message: "User not found" })
    }

    // ✅ CLAVE
    req.dbUser = user

    next()

  } catch (error) {
    console.error("❌ getUser error:", error)
    res.status(500).json({ message: "Server error in getUser" })
  }
}