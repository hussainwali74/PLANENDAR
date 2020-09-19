const mongo = require('mongoose');
const uniqueValidater = require('mongoose-unique-validator');
const eventSchema = mongo.Schema({
    "title": { type: String },
    "date": { type: String },
    "time": { type: String },
    "description": { type: String },
    "privacity": { type: String },
    "extra_fields": []
});
eventSchema.plugin(uniqueValidater);
module.exports = mongo.model('Event', eventSchema);
