const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = require('../models/cart-mongoose');
const Order = require('./order-mongoose');
const Product = require('../models/product-mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean
  },
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.statics.getByEmail = function(email) {
  console.log('user getByEmail:', email);
  return this.findOne({ email: email })
  .then(user => {
    console.log('user.getByEmail:found:', user);
    return user;
  })
  .catch(err => {
    console.log(err);
    return err;
  });
};

userSchema.methods.addToCart = function(product) {
  console.log('user.addToCart:product:', product);
  console.log('user.addToCart:user', this);
  // return this.getCart()
  return Cart.findOne( {userId: new mongoose.Types.ObjectId(this._id)}
    // {
    // $or: [{userId: this._id},
    //       {userId: this._id.toString()}]
    //   }
    )  //.query.or([{userId: this._id}, {userId: this._id.toString()}])
  .then(cart => {
    console.log('user.addToCart:getCart:', cart);
    if (cart._id) {
      return cart;
    } else {
      return Cart.createCart(userId);
    }
  })

  .then(cart => {
    console.log('user.addToCart:foundcart:', cart);
    return cart.addProduct(product);
  })
  .catch(err => {console.log('user.addToCart:error:', err); return err;})
};

userSchema.methods.getId = function() {
  return this._id.toString();
}

userSchema.methods.getCart = function() {
  console.log('user.getCart:', this, 'userId1:', new mongoose.Types.ObjectId(this._id), 'userId2:', this._id.toString());
  // return Cart.findOne({userId: new mongoose.Types.ObjectId(this._id)})   //new mongoose.Types.ObjectId(this._id))
  return Cart.findOne(
    {
        $or: [{userId: new mongoose.Types.ObjectId(this._id)},
            {userId: this._id.toString()}]
    }
  )
  .then(cart => {
    console.log('user.getCart:', cart);
    if (cart && cart._id) {
      return cart;
    } else {
      return this.createCart();
    }
  })
  .catch(err => {console.log('user.getCart:error:', err); return err;})
}

userSchema.methods.removeFromCart = function(productId) {
  console.log('user.removeFromCart:productId:',  productId);
  return this.getCart()
  .then(cart => {
    let fetchedCart = new Cart(cart);  // save before populate
    return Product.findById(productId)
    .then(product => {
      console.log('user.removeFromCart:product:', product);
      return fetchedCart.deleteProduct(productId, product.price );
    })
  });
}

userSchema.methods.addOrder = function() {
  console.log('userSchema.addOrder:start');
  let realCart;
  return this.getCart()
  .then(cartData => {
    realCart = new Cart(cartData); 
    console.log('userSchema.addOrder:realCart', realCart);
    realCart.populate('products.id')
    .execPopulate()
    .then(popCart => {
      popCart.userName = this.name;
      const prods = popCart.products.map(p => {
        console.log('userSchema.addOrder:product:', p.id, p);
        p.id.id = p.id._id; // sometimes p.id.id doesn't exist or is null
        return { id:p.id._id, qty: p.qty, ...p.id._doc}; // _doc is all the data fields
      });
      // console.log('userSchema.addOrder:products:', prods);
      popCart.items = prods;
      console.log('userSchema.addOrder:popCart2:', popCart);
      // return Order.createOrder(popCart); // this is theone we can monkey with
      const order = new Order({
        userId: popCart.userId,
        userName: popCart.userName,
        items: popCart.items,
        totalPrice: popCart.totalPrice
      });
      console.log('userSchema.createOrder:order:', order);
      return order.save();
      })
      .then(result => {
          realCart.products = [];
          realCart.totalPrice = 0;
          return realCart.save();
      })
    });
  }

  userSchema.methods.getOrders = function() {
    console.log('userSchema.getOrders:', this._id);
    return Order
    .find({userId: this._id});  
      // the _id will match whatever the schema defines as the type
      // so if it is string, it will match only strings
      //    if it is an objectid it will match only object ids
      // $or: [{userId: this._id},
      //       {userId: this._id.toString()}
      //       //{userId: new mongoose.Types.ObjectId(this._id)},            
      //       // {'userId': this._id},
      //       // {'userId.toString()': this._id.toString()} //,
      //       // {'userId': new mongoose.Types.ObjectId(this._id)}
      //     ]
      // });
    // return Order.getOrders(this._id.toString());
  }

userSchema.methods.createCart = function() {
  let cart = new Cart({
    userId: this._id,
    products: [],
    totalPrice: 0
  });
  return cart.save()
  .then(result => {
    console.log('user:createCart:result:', result);
    return result;
  }); 
}

module.exports = mongoose.model('User', userSchema);
