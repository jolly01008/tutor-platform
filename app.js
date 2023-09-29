const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const routes = require('./routes/index')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const app = express()
const PORT = 3000
const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.info(`App is running on http://localhost:${PORT}`)
})

module.exports = app
