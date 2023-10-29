const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('admin', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/search', authenticatedAdmin, adminController.getSearchUsers)

module.exports = router
