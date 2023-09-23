const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const courseController = require('../controllers/course-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/teachers', courseController.getTeachers)
router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.use('/', (req, res) => res.redirect('/teachers'))

module.exports = router
