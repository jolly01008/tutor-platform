'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Course.belongsTo(models.User, { foreignKey: 'userId' })
      Course.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  };
  Course.init({
    courseTime: DataTypes.DATE,
    during: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Course',
    tablelName: 'Courses',
    underscored: true
  })
  return Course
}
