'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('order_actions', 'address_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'order_addresses',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('order_actions', 'address_id');
  },
};
