const Sequelize = require('sequelize');

const sequelize = require('../util/database-sqlz');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;
