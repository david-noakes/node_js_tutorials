const Sequelize = require('sequelize');

const sequelize = require('../util/database-sqlz');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.STRING(32),
    // autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  // title: Sequelize.STRING,
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(14,4),
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  // },
  // userId: {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // },
  // createDate: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue:  Sequelize.NOW
  }
  // Sequelize will add createdAt and updatedAt as create and modify timestamps
});

module.exports = Product;
