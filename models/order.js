const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
     shippingAddress: {
          type: String,
          required: true,
     },
     postalCode: String,
     country: {
          type: String,
          required: true,
     },
     phone: {
          type: String,
          required: true,
     },
     paymentId: String,
     status: {
          type: String,
          required: true,
          default: 'pending',
          enum: [
               'pending',
               'processed',
               'shipped',
               'out-for-delivery',
               'delivered',
               'cancelled',
               'on-hold',
               'expired',
          ],
     },
     statusHistory: {
          required: true,
          default: 'pending',
          type: [String],
          enum: [
               'pending',
               'processed',
               'shipped',
               'out-for-delivery',
               'delivered',
               'cancelled',
               'on-hold',
               'expired',
          ],
     },
     totalPrice: Number,
     user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     dateOrdered: {
          type: Date,
          default: Date.now,
     },
     orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },],
});
orderSchema.set('toObject',{virtuals :true});
orderSchema.set('toJSON',{virtuals :true});

exports.Order = model('Order', orderSchema);