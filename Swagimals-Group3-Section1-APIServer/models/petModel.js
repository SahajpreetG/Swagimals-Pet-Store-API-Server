const mongoose = require('mongoose');


const petSchema = new mongoose.Schema({

    // petName: {
    //     required: true,
    //     type: String,
    //     index: true,              
    // },
    petType: {
        // required: true,
        type: String,
        index: true,              
    },
    // petPrice: {
    //     required: true,
    //     type: String
    // },
    petBreed: {
        required: true,
        type: String
    },
    petImage: {
        required: true,
        type: String
    },
    petRating: {
        required: true,
        type: String
    }
    

},
    { timestamps: true });

module.exports = mongoose.model('Pet', petSchema)