// server/models/Data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: String,
  value: String
});

module.exports = mongoose.model('Data', dataSchema);
