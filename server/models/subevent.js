'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubEvent.belongsTo(models.Event, { foreignKey: 'EventId' })
      // define association here
    }
  };
  SubEvent.init({
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: { msg: 'Silahkan isi kolom keterangan'},
        notNull: { msg: 'Silahkan isi kolom keterangan'}
      }
    },
    // unit: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate : {
    //     notEmpty: { msg: 'Silahkan isi kolom satuan'},
    //     notNull: { msg: 'Silahkan isi kolom satuan'}
    //   }
    // },
    // price: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: { msg: 'Silahkan isi kolom harga' },
    //     notNull: { msg: 'Silahkan isi kolom harga' }
    //   }
    // },
    // qty: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: { msg: 'Silahkan isi kolom volume' },
    //     notNull: { msg: 'Silahkan isi kolom volume' }
    //   }
    // },
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
        notEmpty: { msg: 'Silahkan isi kolom jumlahBiaya' },
        notNull: { msg: 'Silahkan isi kolom jumlahBiaya' }
      }
    },
    EventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Silahkan pilih salah satu Event' },
        notNull: { msg: 'Silahkan pilih salah satu Event' }
      }
    }
  }, {
    sequelize,
    modelName: 'SubEvent',
  });
  return SubEvent;
};