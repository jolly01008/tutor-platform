const { Course, Score, Teacher } = require('../models')

const scoreController = {
  postScore: (req, res, next) => {
    const userId = req.user.id
    // const teacherId = req.params.id
    const { rating, comment } = req.body
    console.log('req.params內容:', req.params)
    console.log('req.body內容:', req.body)
    Promise.all([
      Course.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id, isDone: true}
        // include: {
        //   model: Teacher,
        //   attributes: ['id']
        // }
      })
    ])
      .then(async ([course]) => {
        console.log('評分controller的 course:', course)
        console.log('要存進資料庫的東西:', rating, comment, userId)
        const result = await Score.create({
          rating,
          comment,
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
