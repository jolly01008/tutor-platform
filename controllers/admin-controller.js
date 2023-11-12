const { User, Teacher } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_msg', '登入成功!')
    res.redirect('/admin/users')
  },
  getUsers: (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      User.findAndCountAll({
        raw: true,
        nest: true,
        where: { isAdmin: null },
        attributes: { exclude: ['password'] },
        limit,
        offset
      }),
      Teacher.findAll({
        raw: true,
        nest: true,
        attributes: { exclude: ['password'] }
      })
    ])
      .then(([users, teachers]) => {
        const usersInfos = users.rows.map(user => {
          // 如果該位使用者是老師，從teachers資料表篩選出相對應的老師資料，並顯示該位老師姓名、介紹
          if (user.isTeacher === 1) {
            teachers.filter(teacher => { return teacher.userId === user.id })
              .forEach(teacher => {
                user.name = teacher.name
                user.introduction = teacher.introduction || '(還沒填寫介紹)'
              })
          }
          return {
            ...user,
            introduction: user.introduction ? user.introduction.toLowerCase() : '(還沒填寫介紹)'
          }
        })
        res.render('admin/users', {
          usersInfos,
          pagination: getPagination(limit, page, users.count)
        })
      })
      .catch(err => next(err))
  },
  getSearchUsers: (req, res, next) => {
    const keyword = req.query.keyword.trim().toLowerCase()
    if (!keyword) throw new Error('搜尋前，請先輸入關鍵字')
    Promise.all([
      User.findAll({
        raw: true,
        nest: true,
        attributes: { exclude: ['password'] },
      }),
      Teacher.findAll({
        raw: true,
        nest: true,
        attributes: { exclude: ['password'] }
      })
    ])
      .then(([users, teachers]) => {
        const usersLowerCase = users.map(user => {
          if (user.isTeacher === 1) {
            teachers.filter(teacher => { return teacher.userId === user.id })
              .forEach(teacher => {
                user.name = teacher.name
                user.introduction = teacher.introduction || '(還沒填寫介紹)'
              })
          }
          return {
            ...user,
            name: user.name.toLowerCase(),
            introduction: user.introduction ? user.introduction.toLowerCase() : '(還沒填寫介紹)'
          }
        })
        const filterUsers = usersLowerCase.filter(user => {
          return user.name.includes(keyword) || user.introduction.includes(keyword)
        })
        if (filterUsers.length === 0) throw new Error('沒有找到這個使用者')
        return res.render('admin/users', { usersInfos: filterUsers, keyword })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
