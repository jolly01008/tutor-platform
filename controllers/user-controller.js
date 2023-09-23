const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) throw new Error('密碼與確認密碼不相符!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('這個帳號已經註冊過了!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_msg', '成功註冊帳號，請重新登入')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
