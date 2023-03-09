const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    Title: {
        required: true,
        type: String,
                    
    },
    Content:{
        required: true,
        type: String
    },
   
    Image: {
        required: false,
        type: String
    },
   
},
    { timestamps: true });

module.exports = mongoose.model('blogs', blogSchema)