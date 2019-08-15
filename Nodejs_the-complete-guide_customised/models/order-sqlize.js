const Sequelize = require('sequelize');

const sequelize = require('../util/database-sqlz');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;
