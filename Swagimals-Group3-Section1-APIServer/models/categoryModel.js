const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

    categoryName: {
        required: true,
        type: String,
        index: true,              
    },
    categoryPet: {
        required: true,
        type: String
    },
    categoryImage: {
        required: true,
        type: String
    },
    categoryBanner: {
        required: true,
        type: String
    },
    categoryDesc: {
        required: true,
        type: String
    }
    

},
    { timestamps: true });

module.exports = mongoose.model('Category', categorySchema)