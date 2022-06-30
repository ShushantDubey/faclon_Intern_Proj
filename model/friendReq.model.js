const mongoose = require('mongoose');

const friendReqSchema = new mongoose.Schema({
    sender: {
        type: String,
        ref: 'Users'
    },
    reciever: {
        type: String,
        ref: 'Users'
    },
    status: {
        type: String,
        default: "pending"
    },
});

const friendReq = mongoose.model('friendReq', friendReqSchema);

module.exports = friendReq;