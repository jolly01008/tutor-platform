const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const courseController = require('../controllers/course-controller')
const userController = require('../controllers/user-controller')
const teacherController = require('../controllers/teacher-controller')
const scoreController = require('../controllers/score-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const auth = require('./modules/auth')
router.use('/admin', admin)
router.use('/auth', auth)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', authenticated, userController.getEditUser)
router.get('/users/:id/apply', authenticated, userController.getApplyTeacher)
router.post('/users/:id/apply', authenticated, userController.postApplyTeacher)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/teachers/search', authenticated, courseController.getSearchTeachers)
router.post('/teachers/:teacherId/appointmentCourse', authenticated, courseController.appointmentCourse)
router.get('/teachers/:id', authenticated, courseController.getTeacher)
router.get('/teacher/:id/edit', authenticated, teacherController.getTeacherEdit)
router.get('/teacher/:id', authenticated, teacherController.getTeacherInfo)

router.get('/teachers', authenticated, courseController.getTeachers)

router.post('/scores', authenticated, scoreController.postScore)

router.use('/', (req, res) => res.redirect('/teachers'))
router.use('/', generalErrorHandler)

module.exports = router
