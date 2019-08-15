const Sequelize = require('sequelize');

const sequelize = require('../util/database-sqlz');

const Cart = sequelize.define('cart', {
    id: {
      type: Sequelize.STRING(32),
      allowNull: false,
      primaryKey: true
    }
  }, 
  {
    // classMethods: {
    //   associate: function(models) {
    //     Todo.belongsTo(models.User);
    //   }
    // },
    // instanceMethods: {   // doesn't work with this version of sequelize - returns not a function
    //   getProducts: function() {
    //       return this.getProducts();
    //   }
    // }
  }
);


module.exports = Cart;

// module.exports = function(sequelize, DataTypes) {
//   var Cart = sequelize.define('cart', {
//     id: {
//       type: Sequelize.STRING(32),
//       allowNull: false,
//       primaryKey: true
//     }
//   }, 
//   {
//     classMethods: {
//       associate: function(models) {
//         Todo.belongsTo(models.User);
//       }
//     // },
//     // instanceMethods: {   // doesn't work with this version of sequelize - returns not a function
//     //   getProducts: function() {
//     //       return this.getProducts();
//     //   }
//     }
//   });
//   Cart.Instance.prototype.getProducts = function () {
//     return this.getProducts();
//   }
//   return Cart;
// };
