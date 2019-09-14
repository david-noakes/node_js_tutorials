const axios = require('axios');
const config = require('../util/config');
const getDb = require('../util/database-mongodb').getDb;
const globalVars = require ('../util/global-vars');
const mockdb = require('../mockdb/mockdb');
const mongodb = require('mongodb');
const mysqldb = require('../util/database-mysql2');

const axiosUrl = config.environment.apiUrl;
const productTable = 'products';
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
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      if (id) {
        this._id = new mongodb.ObjectId(id);
      }
    } 
  }

  static factory(product) {
    let id;
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      id = product._id+'';
    } else {
      id = product.id;
    }
    let p = new Product(id, product.title, product.imageUrl, product.description,
                        product.price, product.createDate, product.modifyDate, product.userId);
    if (config.environment.dbType === config.environment.DB_MONGODB) {
      p._id = product._id;
    } 
    return p;
  }

  create(callback) {
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.addDocument(productTable, this, callback);
    } else if (config.environment.dbType === config.environment.DB_JSONDB) {
      const key = uuidTools.generateId('aaaaaaaaaaaaaaaa');
      this.id = key;
      return axios.post(productsUrl, this);
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      console.log('save:product:mongodb');
      const db = getDb();
      return db
        .collection(productTable)
        .insertOne(this);
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
    this.modifyDate = globalVars.dateString();
    if (config.environment.dbType === config.environment.DB_FILEDB) {
      mockdb.putDocument(productTable, this.id, this, callback);
    } else if (config.environment.dbType === config.environment.DB_MYSQL) {
      return mysqldb.execute(
        'UPDATE products SET title = ?, price = ?, imageUrl = ?, description = ? ' +
          'WHERE  id =  ?',
        [this.title, this.price, this.imageUrl, this.description, this.id]
      );
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      this._id = new mongodb.ObjectId(this.id); 
      const db = getDb();
      // Update the product
      return db
        .collection(productTable)
        .updateOne({ _id: new mongodb.ObjectId(this.id) }, { $set: this });
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
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(productTable)
        .find()
        .toArray()
        .then(products => {
          console.log(products);
          return products.map(product => {
            product.id = product._id;
            return product;
          })
      })
        .catch(err => {
          console.log(err);
        });
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
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(productTable)
        .find({ _id: new mongodb.ObjectId(id) })  // returns a cursor
        .next()                                   // get the first entry
        .then(product => {
          product.id = product._id;
          console.log(product);
          return product;
        })
        .catch(err => {
          console.log(err);
        });
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
    } else if (config.environment.dbType === config.environment.DB_MONGODB) {
      const db = getDb();
      return db
        .collection(productTable)
        .deleteOne({ _id: new mongodb.ObjectId(id) })
        .then(result => {
          console.log('Deleted');
          console.log('result:', result);
          return result;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
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