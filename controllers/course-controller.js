const { Teacher, User, Course, Score } = require('../models')
const sequelize = require('sequelize')
const dayjs = require('dayjs')

const CAN_BOOK_DAYS = 14
const CLASS_TIME = {
  START: 18,
  END: 22
}

const courseController = {
  getTeachers: (req, res, next) => {
    return Promise.all([
      Teacher.findAll({
        raw: true,
        nest: true,
        include: [User]
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('during')), 'totalDuring']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('during')), 'DESC']],
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }]
      })
    ])
      .then(([teachers, topLearnUsers]) => {
        const teachersData = teachers.map(teacher => ({
          ...teacher, introduction: teacher.introduction.substring(0, 50)
        }))
        return res.render('index', { teachers: teachersData, topLearnUsers })
      })
      .catch(err => next(err))
  },
  getSearchTeachers: (req, res, next) => {
    const keyword = req.query.keyword.trim()
    return Promise.all([
      Teacher.findAll({
        raw: true,
        nest: true
      }),
      Course.findAll({
        raw: true,
        nest: true,
        where: { isDone: true },
        attributes: ['userId', [sequelize.fn('SUM', sequelize.col('during')), 'totalDuring']],
        group: ['userId'],
        order: [[sequelize.fn('SUM', sequelize.col('during')), 'DESC']],
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }]
      })
    ])
      .then(([teachers, topLearnUsers]) => {
        // 將每筆老師的名字、介紹等等相關資料，變成小寫
        const teachersLowerCase = teachers.map(teacher => {
          return {
            ...teacher,
            name: teacher.name.toLowerCase(),
            introduction: teacher.introduction.toLowerCase()
          }
        })
        // 篩選符合條件的關鍵字
        const searchTeachers = teachersLowerCase.filter(teacher => {
          return teacher.name.includes(keyword) || teacher.introduction.includes(keyword)
        })
        if (searchTeachers.length === 0) throw new Error(`沒有找到符合${searchTeachers}的老師資料`)
        return res.render('index', { teachers: searchTeachers, keyword, topLearnUsers })
      })
      .catch(err => next(err))
  },
  getTeacher: (req, res, next) => {
    const teacherId = req.params.id
    Promise.all([
      Teacher.findByPk(teacherId, {
        raw: true,
        nest: true
      }),
      Score.findAll({
        raw: true,
        where: { teacherId }
      }),
      Score.findAll({
        raw: true,
        where: { teacherId },
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
      }),
      Course.findAll({
        raw: true,
        where: { teacherId }
      })
    ])
      .then(([teacher, score, avgScore, courses]) => {
        // 平均分數
        const teacherAvgScore = avgScore[0].avgRating == null ? '目前沒有評分' : avgScore[0].avgRating.toFixed(1)

        // 顯示能預約的課程時間
        let availableWeekdays = teacher.appointmentWeek ? JSON.parse(teacher.appointmentWeek) : null
        if (!Array.isArray(availableWeekdays)) { availableWeekdays = [availableWeekdays] }
        // 將availableWeekdays轉成數字並排序
        availableWeekdays = availableWeekdays.map(day => Number(day)).sort((a, b) => a - b)
        // 取得老師的during
        const during = Number(teacher.during)
        // 取得已經預約好的課程之時間，用dayjs套件讓時間變成 mm-dd hh:mm ; utc()是解決時區問題
        const bookedCourseTime = courses.filter(course => course.courseTime > Date.now())
          .map(course => dayjs(course.courseTime).format('YYYY-MM-DD HH:mm'))
        // 以availableWeekdays拿到未來兩周可預約的18:00~22:00之時間
        const availableTimes = []
        // 今天星期幾
        const todayWeekday = dayjs().day()

        for (let day = 0; day < CAN_BOOK_DAYS; day++) {
          // 今天星期幾+0~14(未來兩周)，並除以7的餘數(一周7天，7為一個循環)，會得到0~6，代表weekday，也就是星期幾
          const weekday = (todayWeekday + day) % 7
          // 判斷availableWeekdays有無包含weekday
          // 若有，則列出該"星期幾"，during為30、60的課程。包括星期幾 (add()幾天後)、幾時、幾分
          if (availableWeekdays.includes(weekday)) {
            for (let j = CLASS_TIME.START; j < CLASS_TIME.END; j++) {
              if (during === 30) {
                availableTimes.push(dayjs().add(day, 'day').hour(j).minute(0).format('YYYY-MM-DD HH:mm'))
                availableTimes.push(dayjs().add(day, 'day').hour(j).minute(30).format('YYYY-MM-DD HH:mm'))
              }
              if (during === 60) {
                availableTimes.push(dayjs().add(day, 'day').hour(j).minute(0).format('YYYY-MM-DD HH:mm'))
              }
            }
          }
        }
        // 用availableTimes扣去bookedClassesTime，已經預約過的課程不用再顯示出來
        const availableTimesAfterBooked = availableTimes.filter(availableTime => !bookedCourseTime.includes(availableTime))

        res.render('users/teacher', { teacher, score, teacherAvgScore, availableTimesAfterBooked })
      })
      .catch(err => next(err))
  },
  appointmentCourse: (req, res, next) => {
    const { appointmentTime } = req.body
    const teacherId = req.params.teacherId
    const userId = req.user.id
    if (!dayjs(appointmentTime).isValid()) throw new Error('請選擇想預約的日期！')
    return Promise.all([
      Teacher.findByPk(teacherId, {
        raw: true,
        nest: true,
        include: [{
          model: User,
          attributes: ['id']
        }]
      }),
      Course.findOne({
        where: { courseTime: appointmentTime, teacherId }
      })
    ])
      .then(([teacher, appointmentedCourse]) => {
        if (appointmentedCourse) throw new Error('這個課程已經被預約過了!')
        if (userId === teacher.User.id) throw new Error('不能預約自己的課程')
        const during = teacher.during
        return Course.create({
          courseTime: appointmentTime,
          teacherId,
          userId,
          during
        })
      })
      .catch(err => next(err))
  }
}

module.exports = courseController
