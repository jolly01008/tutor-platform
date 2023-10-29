const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req) && getUser(req).isAdmin === null) {
    return next()
  } else if (ensureAuthenticated(req) && getUser(req).isAdmin === true) {
    // 登入後若為admin身分，無法進入一般使用者頁面，返回/admin/users
    req.flash('error_msg', ' admin身分，只有admin頁面權限')
    res.redirect('/admin/users')
  }
  else {
    req.flash('error_msg', '請先登入！')
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req) && getUser(req).isAdmin === true) {
    return next()
  } else if (ensureAuthenticated(req) && getUser(req).isAdmin === null) {
    // 登入後若非admin身分，無法進入admin頁面，返回/teachers
    req.flash('error_msg', '沒有admin權限')
    res.redirect('/teachers')
  }
  else {
    req.flash('error_msg', '請先登入')
    res.redirect('/admin/signin')
  }
}

module.exports = { authenticated, authenticatedAdmin }
