const bcrypt = require('bcryptjs')
const db = require('../config/db')

async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

async function findUserById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id])
  return rows[0] || null
}

async function registerUser({ email, username, password }) {
  const existingEmail = await findUserByEmail(email)
  if (existingEmail) {
    const error = new Error('Email already in use')
    error.status = 409
    throw error
  }

  const [usernameRows] = await db.query('SELECT id FROM users WHERE username = ?', [username])
  if (usernameRows.length > 0) {
    const error = new Error('Username already in use')
    error.status = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [result] = await db.query(
    'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)',
    [email, username, passwordHash, 'user']
  )

  return findUserById(result.insertId)
}

async function loginUser({ email, password }) {
  const user = await findUserByEmail(email)
  if (!user) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  return user
}

module.exports = {
  registerUser,
  loginUser,
  findUserById
}
