const mongoose = require('mongoose')

const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model('Person', PersonSchema)