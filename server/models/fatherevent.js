"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FatherEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FatherEvent.belongsTo(models.Cash, { foreignKey: "CashId" });
      FatherEvent.hasMany(models.ChildEvent, { foreignKey: "FatherEventId" });
    }
  }
  FatherEvent.init(
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
      jumlahBiaya: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom jumlah biaya" },
          notNull: { msg: "Silahkan isi kolom jumlah biaya" },
        },
      },
      CashId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Silahkan isi kolom relasi" },
          notNull: { msg: "Silahkan isi kolom relasi" },
        },
      },
    },
    {
      sequelize,
      modelName: "FatherEvent",
    }
  );
  return FatherEvent;
};
