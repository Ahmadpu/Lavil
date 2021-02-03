
const mongoose = require('mongoose');
const noteSchema = mongoose.Schema({
    title: String,
    content : String
},{
    timestamps : true
});
module.exports = mongoose.model('Note',noteSchema);