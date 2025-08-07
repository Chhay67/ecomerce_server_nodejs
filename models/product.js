
const { Schema, model } = require('mongoose');

const productSchema = new Schema({
     name: {
          type: String,
          required: true,
     },
     description: {
          type: String,
          required: true,
     },
     price: {
          type: Number,
          required: true,
     },
     rating: {
          type: Number,
          default: 0, // Default to 0 if no rating is provided
     },
     colours: [{
          type: String, // Array of strings to hold multiple colours

     }],
     image: {
          type: String,
          required: true,
     },
     images: [{
          type: String,

     }],
     reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
     numberOfReviews: {
          type: Number,
          default: 0, // Default to 0 if no reviews are present
     },
     sizes: [{ type: String }], // Array of strings to hold multiple sizes
     category: {
          type: Schema.types.ObjectId,
          ref: 'Category',
          required: true,
     },
     genderAgeCategory: {
          type: String,  // e.g., '     
          enum: ['men', 'women', 'kids'],
     },
     countInStock: {
          type: Number,
          required: true,
          min: 0, // Minimum stock count is 0
          max: 255
     },
     dateAdded: {
          type: Date,
          default: Date.now, // Automatically set to current date if not provided
     }




});

productSchema.pre('save', async function (next) {
     if (this.reviews.length > 0) {
          await this.populate('reviews');
          const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
          this.rating = totalRating / this.reviews.length; // Calculate average rating
          this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1)); // Round to one decimal place
          this.numberOfReviews = this.reviews.length; // Update number of reviews
     }
     next();
});

productSchema.index({ name: 'text', description: 'text' }); // Create a text index for full-text search



productSchema.set('toObject',{virtuals :true});
productSchema.set('toJSON',{virtuals :true});

exports.Product = model('Product', productSchema);