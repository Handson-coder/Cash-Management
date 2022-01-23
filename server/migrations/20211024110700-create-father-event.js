'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FatherEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      keterangan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      anggaranAwal: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      anggaranTerpakai: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      jumlahBiaya: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      CashId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Cash",
          key: "id"
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FatherEvents');
  }
};