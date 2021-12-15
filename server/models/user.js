'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.History, { foreignKey: "UserId" });
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan isi kolom email' },
        notNull: { msg: 'Silahkan isi kolom email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan isi kolom password' },
        notNull: { msg: 'Silahkan isi kolom password' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan isi kolom role' },
        notNull: { msg: 'Silahkan isi kolom role' }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};