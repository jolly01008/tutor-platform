'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasOne(models.Teacher, { foreignKey: 'userId' })
      User.hasMany(models.Course, { foreignKey: 'userId' })
      User.hasMany(models.Score, { foreignKey: 'userId' })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://cdn-icons-png.flaticon.com/512/3171/3171065.png'
    },
    isTeacher: DataTypes.BOOLEAN,
    nation: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
