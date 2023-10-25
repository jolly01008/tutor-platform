const { Course, Score, Teacher } = require('../models')

const scoreController = {
  postScore: (req, res, next) => {
    const userId = req.user.id
    const teacherId = req.params.teacherId // 取得路由中的teacherId(使用者點擊的老師)
    const { rating, comment } = req.body
    Promise.all([
      Course.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id, isDone: true},
        include: {
          model: Teacher,
          attributes: ['id']
        }
      })
    ])
      .then(([course]) => {
        if (!course) throw new Error('沒有這個課程')
        if (!rating || !comment) throw new Error('評分與評論都要填寫!')
        const result = Score.create({
          rating,
          comment,
          teacherId,
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
