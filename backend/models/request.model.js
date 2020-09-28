const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User, Like, Follow and Comment schemas
 */
const friendRequestSchema = Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            default: 'pending',

        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('FriendRequest', friendRequestSchema);