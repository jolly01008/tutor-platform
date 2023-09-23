const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) throw new Error('Password do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          res.render('signup', { name, email, password, confirmPassword })
          throw new Error('Email already exists!')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
      .catch(err => console.log(err))
  }
}

module.exports = userController
