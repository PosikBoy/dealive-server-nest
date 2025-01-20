'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('orders', ['track_number'], {
      name: 'order_track_number', // Имя индекса
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('orders', 'order_track_number');
  },
};
