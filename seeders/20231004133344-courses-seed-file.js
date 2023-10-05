'use strict'

const faker = require('faker')

function getRandomPastTime () {
  const pastDate = faker.date.between('2023-10-04T18:00:00.000Z', '2023-10-04T21:00:00.000Z')
  pastDate.setMinutes(0)
  pastDate.setSeconds(0)
  return pastDate
}

function getRandomFutuerTime () {
  const futureDate = faker.date.between(
    new Date(),
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Date.now單位是毫秒，兩周14天，一天24小時，一小時60分鐘，一分鐘60秒，一秒1000毫秒
  )
  futureDate.setMinutes(0)
  futureDate.setSeconds(0)

  const randomHour = faker.datatype.number({ min: 18, max: 22 })
  futureDate.setHours(randomHour, 0, 0, 0)
  return futureDate
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id from Users;')
    const teachers = await queryInterface.sequelize.query('SELECT id, during from Teachers')
    const courses = []
    // 每個使用者，至少有2個Lesson History可以打分
    users[0].forEach((user, i) => {
      Array.from({ length: 2 })
        .map((_, j) => {
          const randomTeacherNum = Math.floor(Math.random() * teachers.length)

          return courses.push({
            course_time: getRandomPastTime(),
            during: teachers[0][randomTeacherNum].during,
            is_done: true,
            user_id: user.id,
            teacher_id: teachers[0][randomTeacherNum].id,
            created_at: new Date(),
            updated_at: new Date()
          })
        })
    })

    // 每個老師有至少 2 個 New Lesson (2個還沒上過的課程)
    teachers[0].forEach((teacher, i) => {
      Array.from({ length: 2 })
        .map((_, j) => {
          const randomUserNum = Math.floor(Math.random() * users[0].length)

          return courses.push({
            course_time: getRandomFutuerTime(),
            during: teacher.during,
            user_id: users[0][randomUserNum].id,
            teacher_id: teacher.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        })
    })
    await queryInterface.bulkInsert('Courses', courses)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', {})
  }
}
