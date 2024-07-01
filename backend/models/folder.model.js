const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    title: { type: String, required: true},
    comment: { type: String, default: ""},
    userId: { type: String, required: true},
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model('Folder', folderSchema);