const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const courseController = require('../controllers/course-controller')

router.use('/admin', admin)
router.get('/teachers', courseController.getTeachers)

router.use('/', (req, res) => res.redirect('/teachers'))

module.exports = router
