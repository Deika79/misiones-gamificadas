const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const { auth0Id, email } = req.user;

    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({
        auth0Id,
        email
      });

      await user.save();
    }

    req.dbUser = user;

    next();
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Error de servidor" });
  }
};