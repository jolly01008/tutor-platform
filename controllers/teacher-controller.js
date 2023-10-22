const { Teacher, User, Course, Score } = require('../models/')
const sequelize = require('sequelize')
const dayjs = require('dayjs')

const teacherController = {
  getTeacherInfo: (req, res, next) => {
    const teacherId = req.params.id
    Promise.all([
      Teacher.findOne({
        raw: true,
        nest: true,
        where: { userId: req.user.id },
        include: [{
          model: User,
          attributes: { exclude: ['password'] }
        }]
      }),
      Score.findAll({
        raw: true,
        nest: true,
        where: { teacherId },
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { teacherId },
        include: [
          { model: Teacher, attributes: ['courseLink'] },
          { model: User, attributes: ['name'] }]
      }),
      Score.findAll({
        raw: true,
        nest: true,
        where: { teacherId },
        order: [['rating', 'DESC']]
      })
    ])
      .then(([teacher, avgScore, courses, scores]) => {
        const teacherAvgScore = avgScore[0].avgRating.toFixed(1)
        const futureCourses = courses
          .filter(course => {
            return course.courseTime > new Date()
          }).map(course => {
            course.courseTime = dayjs(course.courseTime).format('YYYY-MM-DD HH:mm')
            return course
          })

        res.render('teachers/teacher-profile', { teacher, teacherAvgScore, futureCourses, scores })
      })
      .catch(err => next(err))
  },
  getTeacherEdit: (req, res, next) => {
    const userId = req.user.id
    if (userId !== Number(req.params.id)) throw new Error('沒有權限！')
    Promise.all([
      Teacher.findOne({
        raw: true,
        where: { userId }
      })
    ])
      .then(([teacher]) => {
        const appointmentDays = JSON.parse(teacher.appointmentWeek)
        res.render('teachers/edit-teacher', { teacher, appointmentDays })
      })
      .catch(err => next(err))
  },
  putTeacher: (req, res, next) => {
    const userId = req.user.id
    const { name, avatar, introduction, style, during, courseLink } = req.body
    const appointmentWeekString = req.body.appointmentWeek ? JSON.stringify(req.body.appointmentWeek) : null
    if (userId !== Number(req.params.id)) throw new Error('沒有權限!')
    if (!name || !avatar || !introduction || !style || !during || !courseLink || !courseLink || !appointmentWeekString) throw new Error('請填寫所有欄位！')
    Promise.all([
      Teacher.findOne({ where: { userId } })
    ])
      .then(([teacher]) => {
        teacher.update({
          name,
          avatar,
          introduction,
          style,
          during,
          courseLink,
          appointmentWeek: appointmentWeekString
        })
      })
      .then(() => {
        req.flash('success_msg', '資料修改完成!')
        res.redirect(`/teacher/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = teacherController
