const User = require("../models/User")

module.exports = async (req, res, next) => {
  try {

    // 🔥 CAMBIO CLAVE: usar req.auth
    const auth0Id = req.auth?.sub
    const email = req.auth?.email || ""

    if (!auth0Id) {
      console.error("❌ No auth0Id in token")
      return next()
    }

    let user = await User.findOne({ auth0Id })

    if (!user) {
      user = await User.create({
        auth0Id,
        email,
        role: "student"
      })

      console.log("✅ User created:", auth0Id)
    }

    // ✅ guardar usuario en request
    req.dbUser = user

    next()

  } catch (error) {
    console.error("❌ Error syncing user:", error)
    next()
  }
}