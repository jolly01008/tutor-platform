'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('12345678', 10)
    await queryInterface.bulkInsert('Users', [{
      name: 'user1',
      email: 'user1@example.com',
      password: hashedPassword,
      introduction: 'I am user1',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png',
      is_teacher: false,
      nation: 'Taiwan',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: 'user2',
      email: 'user2@example.com',
      password: hashedPassword,
      introduction: 'I am user2',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png',
      is_teacher: false,
      nation: 'Taiwan',
      created_at: new Date(),
      updated_at: new Date()
    }
    ])
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 18 }).map(() => ({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashedPassword,
        introduction: faker.lorem.text().substring(0, 80),
        avatar: `https://loremflickr.com/150/150/human/?random=${Math.random() * 100}`,
        is_teacher: false,
        nation: faker.address.country(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
