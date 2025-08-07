
const {Schema,model} = require('mongoose');

const categorySchema = new Schema({
     name: {
        type: String,
        required: true,
     },
     colour: {
        type: String,
        default: '#000000', // Default to black if no colour is provided
     
     },
     image: {
        type: String,
        required: true,
     },
     markedForDeletion: {
        type: Boolean,   
        default: false, // Default to false if not specified
     },
});



categorySchema.set('toObject',{virtuals :true});
categorySchema.set('toJSON',{virtuals :true});
exports.Category = model('Category', categorySchema);