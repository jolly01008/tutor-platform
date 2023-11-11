const { Course, Score, Teacher } = require('../models')

const scoreController = {
  postScore: (req, res, next) => {
    const userId = req.user.id
    const { rating, comment } = req.body
    Promise.all([
      Course.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id, isRated: false, id: req.params.courseId },
        include: {
          model: Teacher,
          attributes: ['id']
        }
      }),
      Course.findAll({
        where: { userId: req.user.id, isRated: false, id: req.params.courseId }
      })
    ])
      .then(([course, ratedCourse]) => {
        if (course[0].courseTime > new Date()) throw new Error('這個課程尚未開始，無法評分')
        if (!course) throw new Error('沒有這個課程')
        if (!rating || !comment) throw new Error('評分與評論都要填寫!')
        ratedCourse[0].update({ isRated: true })
        const result = Score.create({
          rating,
          comment,
          teacherId: course[0].Teacher.id,
          userId
        })
        return result
      })
      .then(() => {
        req.flash('success_msg', '評論成功!')
        return res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = scoreController
