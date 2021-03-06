"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cash extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cash.hasMany(models.FatherEvent, { foreignKey: "CashId" });
    }
  }
  Cash.init(
    {
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom kode anggaran" },
          notNull: { msg: "Silahkan isi kolom kode anggaran" },
        },
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom keterangan anggaran" },
          notNull: { msg: "Silahkan isi kolom keterangan anggaran" },
        },
      },
      cash: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom nominal anggaran" },
          notNull: { msg: "Silahkan isi kolom nominal anggaran" },
        },
      },
      anggaranAwal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom anggaran awal" },
          notNull: { msg: "Silahkan isi kolom anggaran awal" },
        },
      },
      anggaranTerpakai: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom anggaran terpakai" },
          notNull: { msg: "Silahkan isi kolom anggaran terpakai" },
        },
      },
    },
    {
      sequelize,
      modelName: "Cash",
    }
  );
  return Cash;
};
