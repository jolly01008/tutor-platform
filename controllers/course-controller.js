const { Teacher, User } = require('../models')

const courseController = {
  getTeachers: (req, res, next) => {
    Teacher.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(teachers => {
        const data = teachers.map(r => ({
          ...r, introduction: r.introduction.substring(0, 50)
        }))
        return res.render('index', { teachers: data })
      })
      .catch(err => next(err))
  }
}

module.exports = courseController
