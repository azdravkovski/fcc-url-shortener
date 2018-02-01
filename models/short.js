const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  longURL: String,
  shortURL: String
}, {timestamps: true});

const ModelClass = mongoose.model('shortURL', urlSchema);

module.exports = ModelClass;