const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    products: [
        {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true }
});

cartSchema.methods.addProduct = function(product) {
  console.log('cart.addProduct:product:', product);
  const existingProductIndex = this.products.findIndex(cp => {
    return cp.id.toString() === product._id.toString();
  });

  const updatedCartItems = [...this.products];

  // Add new product/ increase quantity
  if (existingProductIndex >= 0) {
    const existingProduct = updatedCartItems[existingProductIndex];
    console.log('existingProduct', existingProduct)
    existingProduct.qty = existingProduct.qty + 1;
  } else {
    const addedProduct = { id: product._id, qty: 1, _id:product._id }; // mongoose is adding an id
    console.log('new product', addedProduct);
    updatedCartItems.push(addedProduct);
  }
  this.products = updatedCartItems;
  // the new quantity is always 1
  // round to 2 decimals
  const a6 = Math.round((this.totalPrice + +product.price + 0.001) * 100) / 100;
  console.log('new price:', a6);

  this.totalPrice = a6;

  // console.log('cart.addProduct.updatedCart:', this);

  return this.save();

};

cartSchema.methods.deleteProduct = function(id, productPrice) {
  console.log('cart.deleteProduct:id', id, 'price:', productPrice);
  console.log('products[]:', this.products);
  const idx = this.products.findIndex(prod => prod.id.toString() === id.toString());
  if (idx < 0) {
    console.log('cart.deleteProduct: nothing to delete');
    return Promise.resolve({ msg: 'nothing to delete'});
  }
  const product = this.products[idx];
  console.log(product);
  const productQty = product.qty;
  this.products = this.products.filter(
    prod => prod.id.toString() !== id.toString()
  );
  const a7 =
    this.totalPrice - productPrice * productQty;
  const a8 = Math.round((a7 + 0.001) * 100) / 100;
  console.log(a7, a8);
  this.totalPrice = a8;

  return this.save();
}

cartSchema.methods.clearCart = function() {
  this.products = [];
  this.totalPrice = 0;
  console.log('clearCart: ', this);
  return this.save();
}

cartSchema.statics.getCart = function(userId) {
  console.log('cart-model.getCart:userId:', userId);
  return this
    .findOne(
      {
      $or: [{userId: new Schema.Types.ObjectId(userId)},
        {userId: userId}]
        }
      )
    // .then(cart => {
    //   if (cart && cart._id) {
    //     return cart;
    //   } else {
    //     return cartSchema.createCart(userId);
    //   }
    // })
}


module.exports = mongoose.model('Cart', cartSchema);

