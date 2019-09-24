const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {type: String, required: true, ref: 'User'},
  userName: {type: String, required: true},
  items: [
      {
      id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      qty: { type: Number, required: true }
      }
  ],
  totalPrice: { type: Number, required: true }
});

// orderSchema.methods.createOrder = function(cart) {
//   console.log('orderSchema.createOrder:cart:', cart);
  
//     if (!cart)   {
//       const eMsg = 'order-model.createOrder: cart does not exist';
//       console.log(eMsg);
//       return Promise.resolve({ error: eMsg});
//     }
//     // Order.factory expects an order object.
//     // cart.items = cart.products;  already done
//     // cart.id = null;            // we need to create it
//     // cart._id = null;
//     const order = new Order({
//       userId: cart.userId,
//       userName: cart.userName,
//       items: cart.items,
//       totalPrice: cart.totalPrice
//     });
//     console.log('orderSchema.createOrder:order:', order);
//     return order.save();
//   }

orderSchema.methods.getOrders = function(usrId) {
    console.log('in order.getOrders:', usrId);
    return Order
    .find( { userId: new mongodb.ObjectId(usrId) });
  }

module.exports = mongoose.model('Order', orderSchema);

