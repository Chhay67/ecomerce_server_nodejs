const { Schema, model } = require('mongoose');

const cartProductSchema = new Schema({
     product: {     
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
     },
     quantity: {
          type: Number,
          default: 1, // Default to 1 if no quantity is provided
     },
     productName: {
          type: String,
          required: true,
     },
     productImage: {
          type: String,
          required: true,
     },
     productPrice: {
          type: Number,
          required: true,
     },
     selectedSize: String,
     selectedColour: String,

     reservationExpiry: {
          type: Date,
          default:() => new Date(Date.now() + 30*60*1000),
     },
     reserved : {
          type: Boolean,
          default: false, // Default to false if not specified
     },
});


cartProductSchema.set('toObject', { virtuals: true });
cartProductSchema.set('toJSON', { virtuals: true });


exports.Order = model('Cart', cartProductSchema);