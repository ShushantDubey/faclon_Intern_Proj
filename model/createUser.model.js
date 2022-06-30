const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    friendlist:[{
        type: String,
        ref: 'Users',
    }],

});

const User = mongoose.model('Users', userSchema);

module.exports = User;