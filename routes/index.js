const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const courseController = require('../controllers/course-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const auth = require('./modules/auth')
router.use('/admin', admin)
router.use('/auth', auth)
router.get('/teachers', authenticated, courseController.getTeachers)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)
router.use('/', generalErrorHandler)

router.use('/', (req, res) => res.redirect('/teachers'))

module.exports = router
