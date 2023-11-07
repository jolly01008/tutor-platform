'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出所有users資料，但排除user1、user2
    const users = await queryInterface.sequelize.query(
      'SELECT id, name, avatar FROM Users WHERE email NOT IN (\'user1@example.com\', \'user2@example.com\');',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 打亂 users 陣列
    const shuffledUsers = users.sort(() => 0.5 - Math.random())
    // 單獨取出user2使用者資料
    const userTwo = await queryInterface.sequelize.query(
      'SELECT id, name, avatar FROM Users WHERE email = \'user2@example.com\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // 9位使用者變成老師，存到Teachers資料表
    await queryInterface.bulkInsert('Teachers',
      Array.from({ length: 9 }).map((v, index) => {
        // 運用被打亂的shuffledUsers(隨機選出9個使用者的概念)讓User.isTeacher = true
        queryInterface.sequelize.query(`UPDATE Users SET is_teacher = true WHERE id = ${shuffledUsers[index].id}`)
        return {
          name: users[index].name || faker.name.findName(),
          avatar: users[index].avatar || 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png',
          introduction: faker.lorem.text().substring(0, 80),
          style: faker.lorem.text().substring(0, 80),
          during: Math.random() < 0.5 ? 30 : 60,
          course_link: faker.internet.url(),
          // available_weekdays是陣列，但是資料庫裡面是字串，所以要用JSON.stringify轉成字串
          // Array.from({ length: 7 }, (_, i) => (i + 1).toString())產生一個長度為7的陣列，裡面的值是1~7的字串
          // sort(() => 0.5 - Math.random())是將陣列隨機排序
          appointment_week: JSON.stringify(Array.from({ length: 7 }, (_, i) => (i + 1).toString())
            .sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 7) + 1)),
          user_id: shuffledUsers[index].id, // shuffledUsers的index放這邊，就能對應到 user_id
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
    // 指定user2使用者也變成老師，存到Teachers資料表
    await queryInterface.sequelize.query(`UPDATE Users SET is_teacher = true WHERE id = ${userTwo[0].id}`)
    await queryInterface.bulkInsert('Teachers', [{
      name: userTwo[0].name || faker.name.findName(),
      avatar: userTwo[0].avatar || 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png',
      introduction: faker.lorem.text().substring(0, 80),
      style: faker.lorem.text().substring(0, 80),
      during: Math.random() < 0.5 ? 30 : 60,
      course_link: faker.internet.url(),
      appointment_week: JSON.stringify(Array.from({ length: 7 }, (_, i) => (i + 1).toString())
        .sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 7) + 1)),
      user_id: userTwo[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }]
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', {})
    await queryInterface.sequelize.query('UPDATE Users SET is_teacher = false;')
  }
}
