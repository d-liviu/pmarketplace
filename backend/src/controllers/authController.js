const { requireFields } = require('../utils/validation')
const { registerUser, loginUser, findUserById } = require('../services/authService')
const { signToken } = require('../utils/jwt')

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  }
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

function getClearCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  }
}

async function register(req, res, next) {
  try {
    requireFields(req.body, ['email', 'username', 'password'])

    const user = await registerUser(req.body)
    const token = signToken(user)

    res.cookie('token', token, getCookieOptions())

    res.status(201).json({ user: sanitizeUser(user), token })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    requireFields(req.body, ['email', 'password'])

    const user = await loginUser(req.body)
    const token = signToken(user)

    res.cookie('token', token, getCookieOptions())

    res.json({ user: sanitizeUser(user), token })
  } catch (error) {
    next(error)
  }
}

async function me(req, res, next) {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ user: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie('token', getClearCookieOptions())
    return res.json({ message: 'Logged out' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  register,
  login,
  me,
  logout
}
