const bcrypt = require('bcryptjs')
const { User, Teacher, Course } = require('../models')
const sequelize = require('sequelize')
const dayjs = require('dayjs')
const { myRank } = require('../helpers/rank-helpers')

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
  getUser: (req, res) => {
    Promise.all([
      User.findByPk(req.user.id, {
        raw: true
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id },
        include: [{
          model: Teacher,
          attributes: ['name', 'courseLink', 'avatar', 'id']
        }]
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { isDone: true },
        include: [{ model: User, attributes: ['name', 'avatar'] }],
        attributes: [
          'userId',
          [sequelize.fn('sum', sequelize.col('during')), 'total']
        ],
        group: ['userId'],
        order: [
          [sequelize.fn('sum', sequelize.col('during')), 'DESC']
        ]
      })
    ])
      .then(([user, courses, allRanks]) => {
        const pastCourses = courses.filter(course => {
          return new Date(course.courseTime) < new Date()
        })

        const futureCourses = courses.filter(course => {
          return new Date(course.courseTime) >= new Date()
        }).map(course => {
          course.courseTime = dayjs(course.courseTime).format('YYYY/MM/DD HH:mm')
          return course
        })
        const myRankData = myRank(req.user.id, allRanks)
        res.render('users/user-profile', { user, pastCourses, futureCourses, myRankData})
      })
  },
  getEditUser: (req, res) => {
    res.render('users/edit-user')
  },
  getApplyTeacher: (req, res) => {
    return res.render('users/apply-teacher')
  },
  postApplyTeacher: (req, res, next) => {
    const { introduction, style, during, courseLink, appointmentWeek } = req.body
    const userId = req.user.id
    const appointmentWeekString = JSON.stringify(appointmentWeek)
    Promise.all([
      User.findByPk(userId, { raw: true, attributes: { exclude: ['password'] } })
    ])
      .then(([rawUser]) => {
        return Teacher.create({
          name: rawUser.name,
          avatar: rawUser.avatar,
          introduction,
          style,
          during,
          courseLink,
          appointmentWeek: appointmentWeekString,
          userId
        })
      })
      .catch(err => next(err))
    Promise.all([
      User.findByPk(userId, { attributes: { exclude: ['password'] } }),
      Teacher.findOne({ where: { userId } })
    ])
      .then(([user, teacher]) => {
        if (!user) throw new Error('找不到使用者')
        if (teacher) throw new Error('已申請過老師身份')
        return user.update({ isTeacher: '1' })
      })
      .then(() => {
        req.flash('success_msg', '成功提出申請')
        return res.redirect(`/teacher/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
