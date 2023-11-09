const { Teacher, User, Course, Score } = require('../models/')
const sequelize = require('sequelize')
const dayjs = require('dayjs')
const { imgurFileHandler } = require('../helpers/file-helper')

const teacherController = {
  getTeacherInfo: (req, res, next) => {
    const userId = req.user.id
    if (userId !== Number(req.params.id)) throw new Error('沒有權限!')
    // 先取得與teachers table中，userId與req.user.id相符的資料 (目前登入中的使用者，是哪位老師)
    Promise.all([
      Teacher.findOne({
        raw: true,
        nest: true,
        where: { userId },
        include: [{
          model: User,
          attributes: { exclude: ['password'] }
        }]
      })
    ])
      .then(([teacher]) => {
        // 使用這個老師的teacher.id，取得評分、預約的資料
        Promise.all([
          Score.findAll({
            raw: true,
            nest: true,
            where: { teacherId: teacher.id },
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
          }),
          Course.findAll({
            raw: true,
            nest: true,
            where: { teacherId: teacher.id },
            include: [
              { model: Teacher, attributes: ['courseLink'] },
              { model: User, attributes: ['name', 'avatar'] }]
          }),
          Score.findAll({
            raw: true,
            nest: true,
            where: { teacherId: teacher.id },
            order: [['rating', 'DESC']],
            include: [{
              model: User,
              attributes: ['name']
            }]
          })
        ])
          .then(([avgScore, courses, scores]) => {
            const teacherAvgScore = avgScore[0].avgRating == null ? '目前沒有評分' : avgScore[0].avgRating.toFixed(1)
            const futureCourses = courses
              .filter(course => {
                return course.courseTime > new Date()
              }).map(course => {
                course.courseTime = dayjs(course.courseTime).format('YYYY-MM-DD HH:mm')
                return course
              })
            res.render('teachers/teacher-profile', { teacher, teacherAvgScore, futureCourses, scores })
          })
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
    const { name, introduction, style, during, courseLink } = req.body
    const appointmentWeekString = req.body.appointmentWeek ? JSON.stringify(req.body.appointmentWeek) : null
    if (userId !== Number(req.params.id)) throw new Error('沒有權限!')
    if (!name || !introduction || !style || !during || !courseLink || !courseLink || !appointmentWeekString) throw new Error('請填寫所有欄位！')
    const { file } = req // request中的檔案(圖片)取出來
    Promise.all([
      Teacher.findOne({ where: { userId } }),
      imgurFileHandler(file)
    ])
      .then(([teacher, filePath]) => {
        return teacher.update({
          name,
          avatar: filePath || teacher.avatar,
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
