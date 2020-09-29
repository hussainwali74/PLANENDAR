const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User
 */
const notificationSchema = Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        detail: {
            type: String,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);