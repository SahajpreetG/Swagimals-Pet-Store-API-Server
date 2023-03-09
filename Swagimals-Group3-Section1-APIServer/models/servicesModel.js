const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    serviceName: {
        required: true,
        type: String,
                    
    },
    serviceType: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    serviceImg: {
        required: false,
        type: String
    },
    serviceToolTip:{
        required: false,
        type: String
    },
    id : String
},
    { timestamps: true });

module.exports = mongoose.model('Services', serviceSchema)