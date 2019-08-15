const mockdb = require('../jsonDB/mockdb');
const config = require('../util/config');
const axios = require('axios');

const axiosUrl = config.environment.apiUrl;

const userTable = "users";
const cartTable = "carts";
const usersUrl = axiosUrl + '/' + userTable;
const cartUrl = axiosUrl + '/' + cartTable;
const uuidTools = require('../util/uuid-tools');

module.exports = class User {
  constructor (
    email, // { type: String, required: true, unique: true },
    password, // { type: String, required: true }
    name, // { type: String, required: true }
    id
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    if (id) {
      this.id = id;
    }
  }

  static fetchAll(cb) {
    mockdb.getCollection(mockdb.tables[userTable], cb);
  }

  static findById(id, cb) {
    console.log('user findById:', email);
    if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM users WHERE users.id = ?', [id]);
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(usersUrl + '?id=' + id);
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
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(usersUrl + '?email=' + email);
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
    if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute(
        'INSERT INTO carts (id, userId) VALUES (?, ?)',
        [uuidTools.generateId('aaaaaaaaaaaaaaaa'), email]);
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      const cart = new cart(this.email);
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
    if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_MYSQL  ||
        config.environment.dbType === config.environment.DB_FILEDB) {
      return Cart.getCart(userId);
    } else {
      const eMsg = 'user-model.getCart:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

}
