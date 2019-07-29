const mockdb = require('../mockdb/mockdb');

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        // products.push(this);
        mockdb.addProduct(this);
    }

    static fetchAll(cb) {
        // return products;
        // return mockdb.getProducts();
        mockdb.getAllProducts(cb);
    }
}
