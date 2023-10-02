'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id, name, avatar FROM Users ;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Teachers',
      Array.from({ length: 10 }, (v, index) => ({
        name: users[index].name || faker.name.findName(),
        avatar: users[index].avatar || 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png',
        introduction: faker.lorem.text().substring(0, 80),
        style: faker.lorem.text().substring(0, 80),
        during: Math.random() < 0.5 ? 30 : 60,
        course_link: faker.internet.url(),
        appointment_week: JSON.stringify(Array.from({ length: 7 }, (_, i) => (i + 1).toString())
          .sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 7) + 1)),
        // available_weekdays是陣列，但是資料庫裡面是字串，所以要用JSON.stringify轉成字串
        // Array.from({ length: 7 }, (_, i) => (i + 1).toString())產生一個長度為7的陣列，裡面的值是1~7的字串
        // sort(() => 0.5 - Math.random())是將陣列隨機排序
        is_teacher: true,
        user_id: users[index].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', {})
  }
}
