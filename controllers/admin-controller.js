const { User } = require('../models')

const adminController = {
  signInPage: (req, res, next) => {
    res.render('admin/admin-signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_msg', '登入成功!')
    res.redirect('/admin/users')
  },
  getUsers: (req, res, next) => {
    Promise.all([
      User.findAll({
        raw: true,
        where: { isAdmin: null },
        exclude: ['password']
      })
    ])
      .then(([users]) => {
        users = users.map(user => {
          return {
            ...user,
            introduction: user.introduction ? user.introduction.toLowerCase() : '(還沒填寫介紹)'
          }
        })
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  getSearchUsers: (req, res, next) => {
    const keyword = req.query.keyword.trim().toLowerCase()
    Promise.all([
      User.findAll({
        raw: true,
        nest: true,
        exclude: ['password']
      })
    ])
      .then(([users]) => {
        const usersLowerCase = users.map(user => {
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
        return res.render('admin/users', { users: filterUsers, keyword })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
