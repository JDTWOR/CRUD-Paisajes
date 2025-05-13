const mongoose = require('mongoose');

const paisajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Paisaje', paisajeSchema);