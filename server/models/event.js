"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.SubEvent, { foreignKey: "EventId" });
      // define association here
    }
  }
  Event.init(
    {
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom kode" },
          notNull: { msg: "Silahkan isi kolom kode" },
        },
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom keterangan" },
          notNull: { msg: "Silahkan isi kolom keterangan" },
        },
      },
      jumlahBiaya: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom jumlah biaya" },
          notNull: { msg: "Silahkan isi kolom jumlah biaya" },
        },
      },
      // isFinished: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
