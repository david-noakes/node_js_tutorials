const Sequelize = require('sequelize');

const sequelize = require('../util/database-sqlz');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING(32),
    // autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }

});


module.exports = User;
