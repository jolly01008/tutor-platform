const { Teacher, User, Course } = require('../models')
const sequelize = require('sequelize')

const courseController = {
  getTeachers: (req, res, next) => {
    return Promise.all([
      Teacher.findAll({
        raw: true,
        nest: true,
        include: [User]
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('during')), 'totalDuring']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('during')), 'DESC']],
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }]
      })
    ])
      .then(([teachers, topLearnUsers]) => {
        const teachersData = teachers.map(teacher => ({
          ...teacher, introduction: teacher.introduction.substring(0, 50)
        }))
        return res.render('index', { teachers: teachersData, topLearnUsers })
      })
      .catch(err => next(err))
  },
  getSearchTeachers: (req, res, next) => {
    const keyword = req.query.keyword.trim()
    return Promise.all([
      Teacher.findAll({
        raw: true,
        nest: true
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('during')), 'totalDuring']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('during')), 'DESC']],
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }]
      })
    ])
      .then(([teachers, topLearnUsers]) => {
        // 將每筆老師的名字、介紹等等相關資料，變成小寫
        const teachersLowerCase = teachers.map(teacher => {
          return {
            ...teacher,
            name: teacher.name.toLowerCase(),
            introduction: teacher.introduction.toLowerCase(),
          }
        })
        // 篩選符合條件的關鍵字
        const searchTeachers = teachersLowerCase.filter(teacher => {
          return teacher.name.includes(keyword) || teacher.introduction.includes(keyword)
        })
        if (searchTeachers.length === 0) throw new Error(`沒有找到符合${searchTeachers}的老師資料`)
        return res.render('index', { teachers: searchTeachers, keyword, topLearnUsers })
      })
      .catch(err => next(err))
  },
  getTeacher: (req, res) => {
    res.render('users/teacher')
  }
}

module.exports = courseController
