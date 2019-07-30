const mockdb = require('../mockdb/mockdb');

const productTable = "products";
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  create(callback) {
    mockdb.addDocument(productTable, this, callback);
  }

  update(callback) {
    mockdb.putDocument(productTable, this.id, this, callback);
  }

  static fetchAll(cb) {
      mockdb.getCollection(productTable, cb);
  }

  static findById(id, cb) {
    console.log('product findbyid:', id);
    mockdb.getDocumentById(productTable, id, cb);
  }

  static deleteById(id, cb) {
    console.log('product delete:', id);
    mockdb.deleteDocument(productTable, id, cb);
  }

  static deleteImage(imagePath) {
    mockdb.deleteImage(imagePath);
  }
}
