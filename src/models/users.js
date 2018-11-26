const db = require('../../db')
const bcrypt = require('bcrypt')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getOneByUserName(username) {
  return (
    db('users')
    .where({
      username
    })
    .first()
  )
}

//////////////////////////////////////////////////////////////////////////////
// Create a user
//
// 1. Check to see if user already exists
//   a. if so, return a 400 with appropriate error message
// 2. Hash password
// 3. Insert record into database
// 4. strip hashed password away from object
// 5. "return/continue" promise
//////////////////////////////////////////////////////////////////////////////

function create(username, password) {
  return getOneByUserName(username)
    .then(function (data) {
      if (data) throw {
        status: 400,
        message: 'User already exists'
      }

      return bcrypt.hash(password, 10)
    })
    .then(function (hashedPassword) {
      return (
        db('users')
        .insert({
          username,
          password: hashedPassword
        })
        .returning('*')
      )
    })
    .then(function ([data]) {
      delete data.password
    })
}

module.exports = {
  getOneByUserName,
  create
}