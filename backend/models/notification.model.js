const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/**
 * Notification schema that has references to User
 */
// event IS  FOR TRACKING WHICH EVENT THIS NOTIFICATION IS REGARDDING
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
        type: {
            type: String,
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);