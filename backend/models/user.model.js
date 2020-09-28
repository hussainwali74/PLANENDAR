const mongo = require('mongoose');
const uniqueValidater = require('mongoose-unique-validator');
const Schema = mongo.Schema;

const userSchema = mongo.Schema({
    "email": { type: String, required: true, unique: true },
    "name": { type: String, },
    "password": { type: String, required: true },
    "confirmed": { type: Boolean, default: false },
    "photo": { type: String, },
    friendrequests: [{
        type: Schema.Types.ObjectId,
        ref: 'FriendRequest'
    }],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification',
        },
    ],
});
userSchema.plugin(uniqueValidater);
module.exports = mongo.model('User', userSchema);