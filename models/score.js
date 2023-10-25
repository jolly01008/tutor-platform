'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Score.belongsTo(models.User, { foreignKey: 'userId' })
      Score.belongsTo(models.Teacher, { foreignKey: 'teacherId' })
    }
  };
  Score.init({
    rating: DataTypes.FLOAT,
    comment: DataTypes.TEXT,
    teacherId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Score',
    tableName: 'Scores',
    underscored: true
  })
  return Score
}
