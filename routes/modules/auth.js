const express = require('express')
const router = express.Router()

const passport = require('passport')
const userController = require('../../controllers/user-controller')

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)

module.exports = router
