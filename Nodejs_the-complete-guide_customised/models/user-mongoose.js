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
  }
});

userSchema.methods.addToCart = function(product) {
  console.log('user.addToCart:product:', product);
  console.log('user.addToCart:user', this);
  // return this.getCart()
  return Cart.findOne( // {userId: new mongoose.Types.ObjectId(this._id)}
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
  return Cart.findOne(  // {userId: new mongoose.Types.ObjectId(this._id)}
  //   {
  //     $or: [{userId: new mongoose.Types.ObjectId(this._id)},
  //         {userId: this._id.toString()}]
  // }
  )
  .then(cart => {
    console.log('user.getCart:', cart);
    if (cart._id) {
      return cart;
    } else {
      return Cart.createCart(userId);
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
    .find( { userId: this._id.toString() });
    // return Order.getOrders(this._id.toString());
  }

// userSchema.methods.createCart = function() {
//   let cart = new Cart({
//     userId: this._id,
//     products: [],
//     totalPrice: 0
//   });
//   return cart.save()
//   .then(result => {
//     console.log('user:createCart:result:ops:', result.ops);
//     cart._id = result.ops.insertedId;
//     return cart;
//   }); 
// }

// userSchema.methods.getCart = function() {
//   console.log('user:getCart:', this);
//   return Cart.getCart(this.id).then(cart => {
//     console.log('user:getCart:found', cart);
//     let realCart;
//     if (cart && (cart._id)) {
//       console.log('user.getCart:foundcart:', cart);
//       realCart = cart;
//     } else {
//       realCart = Cart.createCart(this.id);
//       console.log('user.getCart:newcart:', realCart);
//     }
//     console.log('foundcart:', realCart);
//     return realCart;
//   }).catch(err => {return err});
// }


module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }


//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
