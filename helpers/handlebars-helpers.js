const dayjs = require('dayjs')

const time = {
  currentYear: () => dayjs().year()
}

module.exports = time
