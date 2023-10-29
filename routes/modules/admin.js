const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
// router.post('/admin/signin', adminController.signIn)
router.get('/users', adminController.getUsers)
router.get('/search', adminController.getSearchUsers)

module.exports = router
