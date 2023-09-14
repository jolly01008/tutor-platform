const express = require('express')
const router = express.Router()
const courseController = require('../controllers/course-controller')

router.get('/teachers', courseController.getTeachers)

router.use('/', (req, res) => res.redirect('/teachers'))

module.exports = router
