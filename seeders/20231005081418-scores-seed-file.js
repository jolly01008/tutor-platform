'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 每個老師有至少 2 個過往上課評價(已上過課，都已被評分、留言)
    const teachers = await queryInterface.sequelize.query('SELECT id from Teachers')
    const users = await queryInterface.sequelize.query('SELECT id from Users;')
    const scores = []

    teachers[0].forEach((teacher, i) => {
      Array.from({ length: 2 })
        .map((_, j) => {
          const randomUserNum = Math.floor(Math.random() * users[0].length)

          return scores.push({
            rating: faker.datatype.float({ min: 0, max: 5, precision: 0.1 }),
            comment: faker.lorem.text().substring(0, 30),
            teacher_id: teacher.id,
            user_id: users[0][randomUserNum].id,
            created_at: new Date(),
            updated_at: new Date()
          })
        })
    })

    await queryInterface.bulkInsert('Scores', scores)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Scores', {})
  }
}
