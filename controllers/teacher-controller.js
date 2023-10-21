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
    res.render('teachers/edit-teacher')
  }
}

module.exports = teacherController
