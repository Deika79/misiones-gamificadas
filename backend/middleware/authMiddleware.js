const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require("../config/auth");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

// 🔥 DEBUG MIDDLEWARE
module.exports = (req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      console.error("JWT ERROR:", err);
      return res.status(401).json({ error: err.message });
    }

    console.log("JWT OK:", req.auth);
    next();
  });
};