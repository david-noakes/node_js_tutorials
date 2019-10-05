const axios = require('axios');
const Cart = require('./cart-model');
const config = require('../util/config');
let getDb;
if (config.environment.dbType === config.environment.DB_MONGODB) {
  getDb = require('../util/database-mongodb').getDb;
}
const globalVars = require ('../util/global-vars');
const mockdb = require('../mockdb/mockdb');
const mongodb = require('mongodb');
const mysqldb = require('../util/database-mysql2');
const Order = require('./order-model');

const axiosUrl = config.environment.apiUrl;

const userTable = 'users';
const cartTable = 'carts';
const usersUrl = axiosUrl + '/' + userTable;
const cartUrl = axiosUrl + '/' + cartTable;
const uuidTools = require('../util/uuid-tools');

module.exports = class User {
  constructor (
    email, // { type: String, required: true, unique: true },
    password, // { type: String, required: true }
    name, // { type: String, required: true }
    id,
    isAdmin // admin access boolean
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    if (id) {
      this.id = id;
    }
    if (isAdmin) {
      this.isAdmin = isAdmin === true;
    }
  }

  static factory(fetchedUser) {
    let id;
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      id = fetchedUser._id+'';
    } else {
      id = fetchedUser.id;
    }
    let u = new User(fetchedUser.email, fetchedUser.password, fetchedUser.name, id);
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      u._id = fetchedUser._id;
    } 
    return u;
  }

  create() {
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db.collection(userTable).insertOne(this).then(u => {
        this.id = u._id + '';
        this._id = u._id;
        return u;
      });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
               config.environment.dbType === config.environment.DB_JSONDB) {
      const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
      this.id = key;
      return axios.post(usersUrl, this).then(u => {
        this.id = u._id;
        this._id = u._id;
        return u;
      });
    }  
  }

  static fetchAll(cb) {
    mockdb.getCollection(mockdb.tables[userTable], cb);
  }

  static findById(id, cb) {
    console.log('user findById:', id);
    if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM users WHERE users.id = ?', [id]);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(userTable)
        .findOne({ _id: new mongodb.ObjectId(id) })
        .then(user => {
          console.log(user);
          const newUser = User.factory(user);
          return newUser;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(usersUrl + '?id=' + id)
      .then(result => {
        console.log(result);
        const newUser = User.factory(result.body);
        return newUser;
      });
  } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      if (cb) {
        mockdb.getDocumentById(userTable, id, cb);
      } else {
        return Promise.resolve(mockdb.getDocumentById(userTable, id));
      }
    } else {
      const eMsg = 'user-model.getByemail:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }
  
  static getByEmail(email, cb) {
    console.log('user getByEmail:', email);
    if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM users WHERE users.email = ?', [email]);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(userTable)
        .findOne({ email: email })
        .then(user => {
          console.log('user.getByEmail:found:', user);
          const newUser = User.factory(user);
          return newUser;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(usersUrl + '?email=' + email)
      .then(result => {
        console.log(result);
        const newUser = User.factory(result.body.data);
        result.body.data = newUser;
        return result;
      });
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
      if (cb) {
        mockdb.getDocumentByEmail(userTable, email, cb);
      } else {
        return Promise.resolve(mockdb.getDocumentByEmail(userTable, email));
      }
    } else {
      const eMsg = 'user-model.getByemail:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  static findByUser(userId, cb) {
    mockdb.searchDocument(mockdb.tables[userTable], (user) => {
      user.email === userId;
    }, cb);
  }

  createCart() {
    console.log('user:createCart:', this);
    if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute(
        'INSERT INTO carts (id, userId) VALUES (?, ?)',
        [uuidTools.generateId('aaaaaaaaaaaaaaaa'), email]);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      let cart = new Cart(this.id);
      const db = getDb();
      return db.collection(cartTable).insertOne(cart)
      .then(result => {
        console.log('user:createCart:result:ops:', result.ops);
        cart._id = result.ops.insertedId;
        const newCart = Cart.factory(cart);
        return newCart;
      });
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      const cart = new Cart(this.id);
      cart.id =  uuidTools.generateId('aaaaaaaaaaaaaaaa');
      return axios.post(cartUrl, cart);
    } else if (config.environment.dbType === config.environment.DB_FILEDB) {
     return Promise.resolve(mockdb.addCart(email));
    } else {
      const eMsg = 'user-model.createCart:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
    
  }
 
  getCart() {
    console.log('user:getCart:', this);
    if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_MONGODB ||
        config.environment.dbType === config.environment.DB_MYSQL  ||
        config.environment.dbType === config.environment.DB_FILEDB) {
      return Cart.getCart(this.id).then(cart => {
        console.log('user:getCart:found', cart);
        let realCart;
        if (cart && (cart.id || cart._id)) {
          console.log('user.getCart:foundcart:', cart);
          realCart = Cart.factory(cart);
        } else {
          realCart = new Cart(this.id);
          console.log('user.getCart:newcart:', realCart);
        }
        console.log('foundcart:', realCart);
        return realCart;
      }).catch(err => {return err});
    } else {
      const eMsg = 'user-model.getCart:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  addToCart(product) {
    return Cart.getCart(this.id)
    .then(cart => {
      let realCart;
      if (cart && (cart.id || cart._id)) {
        console.log('user.addToCart:foundcart:', cart);
        realCart = Cart.factory(cart);
      } else {
        realCart = new Cart(this.id);
        console.log('user.addToCart:newcart:', realCart);
      }
      console.log('foundcart:', realCart);
      return realCart.addProduct(product.id, product.price);
    })
    .catch(err => {console.log('user.addToCart:error:', err); return err;})
  }

  addOrder() {
    if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MONGODB ||
      config.environment.dbType === config.environment.DB_MOCKDB ||
      config.environment.dbType === config.environment.DB_MYSQL  ||
      config.environment.dbType === config.environment.DB_FILEDB) {
      let realCart;
      return this.getCart()
      .then(cartData => {
        realCart = Cart.factory(cartData); 
        return Order.createOrder(cartData); // pass cartData because we can mess with it
      })
      .then(result => {
        realCart.products = [];
        realCart.totalPrice = 0;
        return realCart.save();
      });
    } else {
      const eMsg = 'user-model.addOrder:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  getOrders() {
    // const db = getDB();
    // return db.collection('orders').
    return Order.getOrders(this.id);
  }

}
