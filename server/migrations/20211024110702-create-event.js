'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
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
      jumlahBiaya: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      anggaranAwal: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      anggaranTerpakai: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ChildEventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "ChildEvents",
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
    await queryInterface.dropTable('Events');
  }
};