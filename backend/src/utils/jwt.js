const jwt = require('jsonwebtoken')

function signToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  })
}

module.exports = {
  signToken
}
