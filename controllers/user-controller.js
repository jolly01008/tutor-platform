const bcrypt = require('bcryptjs')
const { User, Teacher } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功!')
    res.redirect('/teachers')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功!')
    req.logout()
    res.redirect('/signin')
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
  },
  getApplyTeacher: (req, res) => {
    return res.render('users/apply-teacher')
  },
  postApplyTeacher: (req, res, next) => {
    const { introduction, style, during, courseLink, appointmentWeek } = req.body
    const userId = req.user.id
    const appointmentWeekString = JSON.stringify(appointmentWeek)
    Promise.all([
      User.findByPk(userId, {
        raw: true,
        attributes: { exclude: ['password'] }
      }),
      Teacher.findOne({ where: { userId } })
    ])
      .then(([user, teacher]) => {
        if (!user) throw new Error('找不到使用者')
        if (teacher) throw new Error('已申請過老師身份')
        return Teacher.create({
          name: user.name,
          avatar: user.avatar,
          introduction,
          style,
          during,
          courseLink,
          appointmentWeek: appointmentWeekString,
          userId
        })
      })
      .then(() => {
        req.flash('success_msg', '成功提出申請')
        return res.redirect(`/teacher/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
