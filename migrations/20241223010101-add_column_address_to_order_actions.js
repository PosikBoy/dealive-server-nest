'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_actions', 'address_id', {
      type: DataTypes.INTEGER,
      allowNull: true, // Укажите `false`, если поле обязательно
      references: {
        model: 'order_addresses',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_actions', 'address_id');
  },
};
