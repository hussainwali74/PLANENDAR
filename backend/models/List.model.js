const mongo = require('mongoose');
const uniqueValidater = require('mongoose-unique-validator');
const Schema = mongo.Schema;

const listSchema = mongo.Schema({
    "name": { type: String, },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},{timestamps:true});
listSchema.plugin(uniqueValidater);
module.exports = mongo.model('List', listSchema);