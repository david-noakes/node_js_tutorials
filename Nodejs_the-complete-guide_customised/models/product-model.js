const mockdb = require('../jsonDB/mockdb');
const mysqldb = require('../util/database-mysql2');
const config = require('../util/config');
const axios = require('axios');
const axiosUrl = config.environment.apiUrl;

const productTable = "products";
const productsUrl = config.environment.apiUrl + '/' + productTable;
const uuidTools = require('../util/uuid-tools');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price, createDate, modifyDate, userId) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
    if (createDate) {
      this.createDate = createDate;
    }
    if (modifyDate) {
      this.modifyDate = modifyDate;
    }
  }

  create(callback) {
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.addDocument(productTable, this, callback);
    } else if (config.environment.dbType === config.environment.DB_JSONDB) {
      const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
      this.id = key;
      return axios.post(productsUrl, this);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
      this.id = key;
      return mysqldb.execute(
        'INSERT INTO products (id, title, price, imageUrl, description) VALUES (?, ?, ?, ?, ?)',
        [this.id, this.title, this.price, this.imageUrl, this.description]
      );
    } else if (config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.post(productsUrl, this);
    } else {
      const eMsg = 'product-model.create:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  update(callback) {
    // console.log('this:', this);
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.putDocument(productTable, this.id, this, callback);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute(
        'UPDATE products SET title = ?, price = ?, imageUrl = ?, description = ? ' +
          'WHERE  id =  ?',
        [this.title, this.price, this.imageUrl, this.description, this.id]
      );
    } else if (config.environment.dbType === config.environment.DB_JSONDB ||
        config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.put(productsUrl + '/' + this.id, this);
    } else {
      const eMsg = 'product-model.update:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  static fetchAll(cb) {
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.getCollection(productTable, cb);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM products');
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
       config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(productsUrl);
    } else {
      const eMsg = 'product-model.fetchAll:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  static findById(id, cb) {
    console.log('product findbyid:', id);
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.getDocumentById(productTable, id, cb);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    } else if (config.environment.dbType === config.environment.DB_MOCKDB ||
        config.environment.dbType === config.environment.DB_JSONDB) {
      return axios.get(productsUrl + '/' + id);
    } else {
      const eMsg = 'product-model.findById:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  static deleteById(id, cb) {
    console.log('product delete:', id);
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      return mockdb.deleteDocument(productTable, id, cb);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute('DELETE FROM products WHERE products.id = ?', [id]);
    } else if (config.environment.dbType === config.environment.DB_JSONDB ||
      config.environment.dbType === config.environment.DB_MOCKDB) {
      return axios.delete(productsUrl + '/' + id);
    } else {
      const eMsg = 'product-model.deleteById:config.environment.dbType:' + config.environment.dbType + ' not supported';
      console.log(eMsg);
      return Promise.resolve({ error: eMsg});
    }
  }

  static deleteImage(imagePath) {
    mockdb.deleteImage(imagePath);
  }

}