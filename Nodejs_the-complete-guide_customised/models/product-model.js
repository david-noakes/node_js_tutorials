const mockdb = require('../mockdb/mockdb');

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

    save() {
        mockdb.addDocument('products', this);
    }

    static fetchAll(cb) {
        mockdb.getCollection('products', cb);
    }
}
