'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SubEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keterangan: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // unit: {
      //   allowNull: false,
      //   type: Sequelize.STRING
      // },
      // price: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
      // qty: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER
      // },
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
      EventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Events",
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
    await queryInterface.dropTable('SubEvents');
  }
};