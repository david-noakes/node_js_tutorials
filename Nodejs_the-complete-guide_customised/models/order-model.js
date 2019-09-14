const axios = require('axios');
const config = require('../util/config');
let getDb;
if (config.environment.dbType === config.environment.DB_MONGODB) {
  getDb = require('../util/database-mongodb').getDb;
}
const mockdb = require('../mockdb/mockdb');
const mongodb = require('mongodb');
const mysqldb = require('../util/database-mysql2');
const ordersTable = "orders";

const axiosUrl = config.environment.apiUrl;
const ordersUrl = axiosUrl + '/' + ordersTable;

module.exports = class Order {
  constructor(userId) {
      this.userId = userId;
      this.items = [];
      this.totalPrice = 0;
      this.id = null;
      if (config.environment.dbType === config.environment.DB_MONGODB) {
        this._id = null;
      }
  }
      
  static factory(orderData) {
    let order = new Order(orderData.userId);
    order.items = orderData.items;
    order.totalPrice = orderData.totalPrice;
    order.id = orderData.id;
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      if (orderData._id) {
        order._id = mongodb.ObjectId(orderData._id);
        order.id = orderData._id.toString();
      } else {
        order._id = order.id = null;    
      }
    }
    return order;
  }

  static createOrder(cart) {
    if (!cart)   {
      const eMsg = 'order-model.createOrder: cart does not exist';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
    // Order.factory expects an order object.
    cart.items = cart.products;
    cart.id = null;            // we need to create it
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      cart._id = null;
    }
    if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MONGODB ||
        config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_MYSQL  ||
        config.environment.dbType === config.environment.DB_FILEDB) {
      const order = Order.factory(cart);
      return order.save();
    } else {
        const eMsg = 'user-model.addOrder:config.environment.dbType:' + config.environment.dbType + ' not supported';
        console.log(eMsg);
        return Promise.resolve({ error: eMsg});
    }      
  }

  static getOrders(usrId) {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_MYSQL  ||
        config.environment.dbType === config.environment.DB_FILEDB) {
      return axios.get(ordersUrl + '?userId=' + usrId);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      console.log('in order.getOrders:', usrId);
      return db
      .collection(ordersTable)
      // .find()  // { userId: new mongodb.ObjectId(usrId) })
      .find( { userId: new mongodb.ObjectId(usrId) })
      .toArray();
    } else {
      const eMsg = 'order-model.getOrders: not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
      }      
  }

  save() {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      if (this.id) {
        return axios.put(ordersUrl + '?id=' + userId, this);
      } else {
        return axios.post(ordersUrl, this);
      }
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      if (this.id) {
        return db.collection(ordersTable).updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
      } else {
        return db.collection(ordersTable).insertOne(this);
      }
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.putCart(loggedInUser, this, (result, error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
    } else {
      const eMsg = 'order-model.addProduct:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }

  }

}  
