'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'track_number', {
      type: DataTypes.STRING(128),
      allowNull: true,
    });
    await queryInterface.addColumn('orders', 'code', {
      type: DataTypes.STRING(6),
      allowNull: true,
    });
    await queryInterface.addColumn('order_addresses', 'comment', {
      type: DataTypes.STRING(1024),
      allowNull: true,
    });
    await queryInterface.changeColumn('order_addresses', 'info', {
      type: DataTypes.STRING(1024),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'track_number');
    await queryInterface.removeColumn('orders', 'code');
    await queryInterface.removeColumn('order_addresses', 'comment');
    await queryInterface.changeColumn('order_addresses', 'info', {
      type: DataTypes.STRING(512),
      allowNull: true,
    });
  },
};
