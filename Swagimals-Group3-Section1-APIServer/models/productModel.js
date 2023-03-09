const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    productName: {
        required: true,
        type: String,
        index: true,              
    },
    productRating: {
        required: true,
        type: String
    },
    productDesc: {
        required: true,
        type: String
    },
    productImage: {
        required: true,
        type: String
    },
    productPrice: {
        required: true,
        type: String
    }
    

},
    { timestamps: true });

module.exports = mongoose.model('Product', productSchema)