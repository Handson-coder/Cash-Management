'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      History.belongsTo(models.User, { foreignKey: "UserId" });
      // define association here
    }
  };
  History.init({
    riwayat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: { msg: 'Silahkan isi kolom riwayat'},
        notNull: { msg: 'Silahkan isi kolom riwayat'}
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan isi kolom UserId' },
        notNull: { msg: 'Silahkan isi kolom UserId' }
      }
    }
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};