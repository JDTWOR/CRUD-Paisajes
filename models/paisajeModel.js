const mongoose = require('mongoose');

const paisajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  imagen: {
    type: String,
    required: [true, 'La imagen es obligatoria']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Paisaje', paisajeSchema);