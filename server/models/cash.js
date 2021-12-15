'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cash extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cash.init({
    cash: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan isi kolom nominal' },
        notNull: { msg: 'Silahkan isi kolom nominal' }
      }
    }
  }, {
    sequelize,
    modelName: 'Cash',
  });
  return Cash;
};