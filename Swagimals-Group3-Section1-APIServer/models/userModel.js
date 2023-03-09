const mongoose = require('mongoose');
// var unique = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({

    userName: {
        required: true,
        type: String,
        index: true,                    // Indexing columns
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: false,
        type: String
    },
    userPswd: {
        required: true,
        type: String
    },
    dateOfBirth: {
        required: false,
        type: Date
    },
    gender: {                              //1 - Male, 2 - Female
        required: false,
        type: Number
    },
    userImg: {
        required: false,
        type: String
    },
    cartId: {
        required: false,
        type: String,
        index: true,
    },
    userRole: {                              // 1 - Admin, 2 - Customer
        required: true,
        type: Number
    },
    isUserActive: {                        // true -IsActive, false - IsNotActive      -- By Active we mean, is user still a member of our portal
        required: true,
        type: Boolean
    },

},
    { timestamps: true });

module.exports = mongoose.model('User', userSchema)